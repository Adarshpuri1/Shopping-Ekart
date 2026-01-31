import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import logo from '../assets/logo.jpg'
import { ShoppingCart } from 'lucide-react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import store from '@/redux/store'
import { toast } from 'sonner'
import { setToken, setUser } from '@/redux/userSlice'
import { setCart, setProducts } from '@/redux/productSlice'



const Navbar = () => {

  const dispatch=useDispatch();
  const users=useSelector(store => store.user.user)
  const accessToken = useSelector(store => store.user.token)
 
  const admin= users?.role === "admin" ? true : false
  const {cart} = useSelector(store => store.product)

  
 
  const navigate = useNavigate();


  const logoutHandler= async()=>{
    try{
      const res=await axios.post(`http://localhost:8000/api/v1/user/logout`,{},{
        headers:{
          Authorization: `Bearer ${accessToken}`
          
        }
        
      })
      
      if(res.data.success){
       
        dispatch(setUser(null));
        dispatch(setToken(null));
        dispatch(setCart());
        toast.success("User logout Successfully");
      }
      
      
    }catch(error){
      console.error(error);
      toast.error(error.response?.data?.message)
    }
  }


  return (
    <div>
        <header className='bg-pink-50 fixed w-full z-20 border-b border-pink-200'>
      <div className='max-w-7xl mx-auto flex justify-between items-center py-2'>
        <div>
          <img src={logo} alt="" className='w-22 h-10' />
        </div>
        <nav className='flex gap-10 justify-between items-center'>
          <ul className='flex gap-7 items-center text-xl font-semibold'>
            <Link to={'/'}><li>Home</li></Link>
            <Link to={'/products'}><li>Product</li></Link>
            {users && <Link to={`/profile/${users._id}`}><li>Hello, {users.firstName}</li></Link>}
            {
              admin && <Link to ={"/dashboard/sales"}><li>Dashboard</li></Link>
            }
          </ul>
          <Link to={'/cart'} className='relative'>
            <ShoppingCart/>
            <span className='bg-pink-500 rounded-full absolute text-white bottom-5 left-5 px-2'>
              {users ? cart?.items?.length || 0 : <h2>0</h2>}
            </span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              
            </DropdownMenuTrigger>
            
          </DropdownMenu>
          {
            users ? <Button onClick={logoutHandler}  className='bg-pink-600 text-white cursor-pointer'>Logout</Button> :
            <Button onClick={() => navigate('/login')} className='bg-gradient-to-tl from-blue-600 text-white cursor-pointer'>Login</Button>
          }
        
        </nav>
      </div>
    </header>
    
      
    </div>
  )
}

export default Navbar
