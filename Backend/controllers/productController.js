import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";


export const addProduct = async (req, resp) => {
    try {
        const { productName, productDesc, productPrice, category, brand } = req.body;
        const userId = req.id;

        if (!productName || !productDesc || !productPrice || !category || !brand) {
            return resp.status(400).json({
                success: false,
                message: "All field are require"
            })
        }

        let productImg = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUrl = getDataUri(file);
                const result = await cloudinary.uploader.upload(fileUrl, {
                    folder: "Ekart-products"
                })
                productImg.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
            }
        }

        const newProduct = await Product.create({
            productName,
            productDesc,
            productPrice,
            category,
            brand,
            productImg
        })
        return resp.status(200).json({
            success: true,
            message: "Product added successfully",
            product: newProduct
        })
    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message
        })
    }
}


export const getAllProduct = async (req, resp) => {
    try {

        const Products = await Product.find();
        if (!Products) {
            return resp.status(400).json({
                success: false,
                message: "Not product avalible",
                Products: []
            })
        }
        return resp.status(200).json({
            success: true,
            Products
        })
    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message
        })
    }
}


export const deleteProduct = async (req, resp) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId)
        if (!product) {
            return resp.status(400).json({
                success: false,
                message: "product not found"
            })
        }
        if (product.productImg&& product.productImg.length > 0) {
            for (let img of product.productImg) {
                const result = await cloudinary.uploader.destroy(img.public_id)
            }
        }
        await Product.findByIdAndDelete(productId)
        return resp.status(200).json({
            success: true,
            message: "Product deleted successsfully"
        })
    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message
        })
    }

}

export const updateProduct = async (req, resp) => {
    try {
        const { productId } = req.params;
        const {
            productName,
            productDesc,
            productPrice,
            category,
            brand,
            existingImages
        } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return resp.status(400).json({
                success: false,
                message: "Product not found"
            });
        }

        let updateImage = [];

        // Handle existing images
        if (existingImages) {
            const keepIds = JSON.parse(existingImages);

            updateImage = product.productImg.filter(img =>
                keepIds.includes(img.public_id)
            );

            const removeImage = product.productImg.filter(
                img => !keepIds.includes(img.public_id)
            );

            for (let img of removeImage) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        } else {
            updateImage = product.productImg;
        }

        // Handle new uploaded images
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const data = getDataUri(file);
                const result = await cloudinary.uploader.upload(data, {
                    folder: "mern_products"
                });

                updateImage.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        }

        // Update product fields
        product.productName = productName || product.productName;
        product.productDesc = productDesc || product.productDesc;
        product.productPrice = productPrice || product.productPrice;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.productImg = updateImage;

        await product.save();

        return resp.status(200).json({
            success: true,
            message: "Product Updated Successfully",
            product
        });

    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message
        });
    }
};