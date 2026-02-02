import React from 'react'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCart } from '@/redux/productSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';

const ProdocutDesc = ({product}) => {

    const accessToken = localStorage.getItem("accessToken");
    const dispatch = useDispatch();
    const addtocart=async(productId)=>{
        try{
            const res= await axios.post(`https://shopping-ekart-backend.onrender.com/api/v1/cart/add`,{productId},{
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if(res.data.success){
                toast.success('Product added successfully')
                dispatch(setCart(res.data.cart))
            }
        }catch(error){
            console.error(error)
        }
    }

  return (
    <div className=' flex flex-col gap-4'>
        <h1 className='font-bold text-4xl text-gray-400'>{product.productName}</h1>
        <p className='text-gray-800'>{product.category} | {product.brand}</p>
        <h2 className='text-pink-500 font-bold text-2xl'>₹{product.productPrice}</h2>
        <p className='line-clamp-4 text-muted-foreground'>{product.productDesc}</p>
        <div className='flex gap-2 items-center w-[300px]'>
            <p className='text-gray-800 font-semibold'>Quantity</p>
            <Input type='number' className='w-14' defaultValue={1}/>
        </div>
        <Button onClick={()=>addtocart(product._id)} className='bg-pink-600 w-max' >Add to cart</Button>
    </div>
  )
}

export default ProdocutDesc
