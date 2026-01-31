import razorpayInstance from "../config/razorpay.js"
import { Cart } from "../models/cartModel.js"
import { Order } from "../models/orderModel.js"
import { Product } from "../models/productModel.js"
import { User } from "../models/userModel.js"
import crypto from 'crypto'

export const createOrder = async (req, resp) => {
    try {
        const { products, amount, tax, shipping, currency } = req.body
        
        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`
        }

        const razorpayOrder = await razorpayInstance.orders.create(options)
        const newOrder = new Order({
            user: req.user._id,
            products,
            amount,
            tax,
            shipping,
            currency,
            status: "Pending",
            razorpayOrderId: razorpayOrder.id
        })

        await newOrder.save();
        return resp.status(200).json({
            success: true,
            order: razorpayOrder,
            dbOrder: newOrder
        })

    } catch (error) {
        console.error(" Error in create Order:",error);
        return resp.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const verifyPayment = async (req, resp) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed } = req.body
    const userId = req.user._id
    
    try {
        if (paymentFailed) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { new: true }
            )
            return resp.status(400).json({
                success: false,
                message: "Payment Failed"
            })
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex")

        if (expectedSignature === razorpay_signature) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    status: "Paid",
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature
                },
                { new: true }
            )
            await Cart.findOneAndUpdate({ userId }, { $set: { items: [], totalPrice: 0 } })
            return resp.status(200).json({
                success: true,
                message: "Payment successfull",
                order
            })
        }
        else {
            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { new: true }
            )
            return resp.status(400).json({
                success: false,
                message: "Invailed Signature"
            })
        }
    } catch (error) {
        console.error("Error in verify payment",error)
        return resp.status(400).json({
            success: false,
            message: error.message
        })
    }

}        

export const getMyOrder = async (req, resp) => {
    try {
        const userId= req.id;
        const orders= await Order.find({user:userId})
        .populate({path:"products.productId",select:"productName productPrice productImg"})
        .populate("user","firstName lastName email")

        resp.status(200).json({
            success: true,
            count:orders.length,
            orders
        })

    } catch (error) {
        return resp.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//admin only

export const getUserOrders = async (req,resp)=>{
    try{
        const {userId}=req.params;
        const orders = await Order.find({user:userId})
        .populate({
            path:"products.productId",
            select:"productName productPrice productImg"
        })
        .populate("user","firstName lastName email")
        resp.status(200).json({
            success:true,
            count:orders.length,
            orders
        })

    }catch(error){
        return resp.status(500).json({
            success: false,
            message:error.message
        })
    }
}

export const getAllOrdersAdmin = async(req,resp)=>{
    try{
        const orders= await Order.find()
        .sort({createAt: -1})
        .populate("user","name email")
        .populate({
            path:"products.productId",
            select:"productName productPrice "
        })
        resp.json({
            success:true,
            count:orders.length,
            orders
        })

    }catch(error){
        return resp.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const getSalesData = async(req,resp)=>{
    try{
        const totalUsers= await User.countDocuments({})
        const totalProducts = await Product.countDocuments({})
        const totalOrders = await Order.countDocuments({status:"Paid"})
         

        //Total sales amount

        const totalSaleAgg= await Order.aggregate([
            {$match : {status:"Paid"}},
            {$group: {_id: null,total:{$sum:"$amount"}}}
        ])
        const totalSales= Math.floor(totalSaleAgg[0]?.total || 0);

        //sale grouped by date(last 30 days)

        const thirtyDaysAgo= new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() -30)

        const salesByDate= await Order.aggregate([
            {$match: {status: "Paid",createAt: {$gte: thirtyDaysAgo }}},
            {
                $group:{
                    _id:{
                        $dateToString : { format: "%Y-%m-%d", date: "$createAt"}
                    },
                    amount: {$sum: "$amount"},
                }
            },
            {$sort: {_id: 1}}
        ])
        
        const formattedSales = salesByDate.map((item)=>({
            date:item._id,
            amount:item.amount
        }))

        
        resp.json({
            success:true,
            totalUsers,
            totalProducts,
            totalOrders,
            totalSales,
            sales:formattedSales
        })

    }catch(error){
        console.error("Error fetching sales date:",error);
        return resp.status(500).json({
            success:false,
            message:error.message
        })
    }

}
