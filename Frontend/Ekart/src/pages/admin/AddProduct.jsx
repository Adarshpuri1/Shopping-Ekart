import ImageUploade from '@/components/ImageUploade';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { setProducts } from '@/redux/productSlice';

import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const AddProduct = () => {
  const [ productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    productDesc: "",
    productImg: [],
    brand: "",
    category: ""
  })

  const accessToken= localStorage.getItem('accessToken');
  const dispatch= useDispatch();
  const {products}= useSelector(store => store.product);
  const [loading, setLoading] = useState(false);

  const handleChange= (e) =>{
    const {name,value}=e.target;
    setProductData((prev) => ({
      ...prev,
      [name]:value
    }))
  }

  const submitHandler = async (e) =>{
    e.preventDefault();
    const form= new FormData();
    form.append("productName",productData.productName);
    form.append("productPrice",productData.productPrice);
    form.append("productDesc",productData.productDesc);
    form.append("category",productData.category);
    form.append("brand",productData.brand);

    if(productData.productImg.length === 0){
      toast.error("Uploade img please")
      return
    }

    productData.productImg.forEach((img) => {
      form.append("files",img)
    })

    try{
      setLoading(true);
      const res= await axios.post("http://localhost:8000/api/v1/product/add",form,{
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if(res.data.success){
        dispatch(setProducts([...products, res.data.product]))
        toast.success(res.data.message)
      }

    }catch(error){
      console.error(error);
    }
    finally {
      setLoading(false)
    }
  }


  return (
    <div className='pl-[350px] py-20 pr-20 mx-auto px-4 bg-gray-400'>
      <Card className='w-full my-20'>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
          <CardDescription>Enter Product details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-2'>
            <Label>Product Name</Label>
            <Input type='text' name='productName' value={productData.productName} onChange={handleChange} placeholder='Ex-IPhone' required />
          </div>
          <div className='flex flex-col gap-2'>
            <Label>Price</Label>
            <Input type='number' name='productPrice' placeholder='' value={productData.productPrice} onChange={handleChange} required />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label>Brand</Label>
              <Input type='text' name='brand' placeholder='Ex-apple'
                value={productData.brand} onChange={handleChange}
                required />
            </div>
            <div className='grid gap-2'>
              <Label>Category</Label>
              <Input type='text' name='category' placeholder='Ex-mobile'
                value={productData.category} onChange={handleChange}
                required />
            </div>
          </div>
          <div className='grid gap-2'>
            <div className='flex items-center'>
              <Label>Description</Label>
            </div>
            <Textarea 
            name="productDesc"
            value={productData.productDesc} 
            onChange={handleChange}
            placeholder="Enter brief Description of product"
            
            />
          </div>
          <ImageUploade productData={productData} setProductData={setProductData} />
          <CardFooter className='flex-col gap-2'>
            <Button disabled={loading} onClick={submitHandler} className='w-full bg-pink-600 cursor-pointer' >
              {loading?<span className='flex gap-1 items-center m-10'><Loader2 className='animate-spin'/>Please wait</span>:"Add Product"}</Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddProduct
