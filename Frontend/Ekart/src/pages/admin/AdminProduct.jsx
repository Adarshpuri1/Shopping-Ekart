import { Input } from '@/components/ui/input'

import React, { useState } from 'react'

 
import { useDispatch, useSelector } from 'react-redux'



import axios from 'axios'
import { setProducts } from '@/redux/productSlice'
import { toast } from 'sonner'
import { Edit, Search, Trash2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ImageUploade from '@/components/ImageUploade'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'





const AdminProduct = () => {
  const [editProduct, setEditProduct] = useState({
    productName: "",
    productPrice: "",
    brand: "",
    category: "",
    productDesc: "",
    productImg: []
  })

  const { products } = useSelector(store => store.product)
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const[searchTerm,setSearchTerm]=useState("")
  const[sortOrder,setSortOrder]=useState("")
  
  let filterProducts = products.filter((product) => {
  return (
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )
  })

if(sortOrder == 'lowtoHigh'){
    filterProducts =[...filterProducts].sort((a,b)=>a.productPrice -b.productPrice)
  }
  if(sortOrder == 'highToLow'){
    filterProducts =[...filterProducts].sort((a,b)=>b.productPrice -a.productPrice)
  }



  const handleChange = (e) => {
    const { name, value } = e.target
    setEditProduct(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlesave = async (e) => {
    e.preventDefault()
    const formData = new FormData();

    formData.append("productName", editProduct.productName)
    formData.append("productDesc", editProduct.productDesc)
    formData.append("productPrice", editProduct.productPrice)
    formData.append("category", editProduct.category)
    formData.append("brand", editProduct.brand)

    //add existing image public_id
    const exisitingImages = editProduct.productImg
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id)

    formData.append("existingImages", JSON.stringify(exisitingImages))


    //add new files
    editProduct.productImg
      .filter((img) => img instanceof File)
      .forEach((file) => {
        formData.append("file", file)
      })

    try {
      const res = await axios.put(`https://shopping-ekart-backend.onrender.com/api/v1/product/update/${editProduct._id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`

        }
      })
      if (res.data.success) {
        toast.success("Product updated successfully")
        const updateProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p)
        dispatch(setProducts(updateProducts))
        setOpen(false)
      }

    } catch (error) {
      console.error(error)
    }

  }

  const deleteProductHandler = async (productId) => {
    try {
      const reminingProducts = products.filter((product) => product._id !== productId)
      const res = await axios.delete(`https://shopping-ekart-backend.onrender.com/api/v1/product/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setProducts(reminingProducts))
      }

    } catch (error) {
      console.error(error)
    }
  }



  return (
    <div className="pl-[350px] py-20 px-20 flex flex-col gap-3 min-h-screen bg-gray-100">
      <div className="flex justify-between">
        <div className="relative bg-white rounded-lg">
          <Input
            type="text"
            placeholder="Search Product..."
            className="w-[400px] items-center"
            values={searchTerm} 
            onChange={(e)=>setSearchTerm(e.target.value)}
          />
          <Search  className="absolute right-3 top-1.5 text-gray-500" />
        </div>
        <Select onValueChange={(value)=>setSortOrder(value)}>
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lowtoHigh">Price: Low to High</SelectItem>
            <SelectItem value="highToLow">Price; High to Low</SelectItem>

          </SelectContent>
        </Select>
      </div>
      {
        filterProducts.map((product, index) => {
          return <Card key={index} className="px-4">
            <div className='flex items-center justify-between'>
              <div className='flex gap-2 items-center'>
                <img src={product?.productImg?.[0]?.url} alt='' className='w-25 h-25' />
                <h1 className='font-bold w-96 text-gray-700'>{product.productName}</h1>
              </div>
              <h1 className='font-semibold text-gray-800'>₹{product.productPrice}</h1>
              <div className='flex gap-3'>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Edit onClick={() => { setOpen(true), setEditProduct(product) }} className='text-green-500 cursor-pointer' />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px] max-h-[740px] overflow-y-scroll">
                    <DialogHeader>
                      <DialogTitle>Share link</DialogTitle>
                      <DialogDescription>
                        Make changes to your product here.Click save you &apos;redone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                      <div className="grid gap-2">
                        <Label >
                          Product Name
                        </Label>
                        <Input
                          type='text'
                          name="productName"
                          placeholder="Ex-Iphone"
                          value={editProduct.productName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label >
                          Price
                        </Label>
                        <Input
                          type='number'
                          name="productPrice"
                          value={editProduct.productPrice}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="grid gap-2">
                          <Label>
                            Brand
                          </Label>
                          <Input
                            type='text'
                            name="brand"
                            placeholder="Ex-Apple"
                            value={editProduct.brand}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>
                          Category
                        </Label>
                        <Input
                          type='text'
                          name="category"
                          placeholder="Ex-Mobile"
                          value={editProduct.category}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className='grid gap-2'>
                        <div className='flex items-center'>
                          <Label>Description</Label>
                        </div>
                        <Textarea name="productDesc" placeholder="enter brief description of product"
                          value={editProduct.productDesc}
                          onChange={handleChange}
                        />

                      </div>
                      <ImageUploade productData={editProduct} setProductData={setEditProduct} />
                    </div>
                    <DialogFooter className="sm:justify-start">
                      <Button onClick={handlesave} type="button" variant="secondary">
                        Save Change
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger>
                    <Trash2 className='text-red-500 cursor-pointer' />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={()=>deleteProductHandler(product._id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>


              
              </div>
            </div>
          </Card>
        })
      }
    </div>

  )
}

export default AdminProduct
