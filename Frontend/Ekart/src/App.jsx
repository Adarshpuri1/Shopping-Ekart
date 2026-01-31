import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Signup from './pages/Signup'
import { ThemeProvider } from 'next-themes'
import Verify from './pages/Verify'
import Login from './pages/Login'
import Profile from './pages/Profile'
import VerifyEmail from './pages/VerifyEmail'
import Reverify from './pages/Reverify'
import ForgetPassword from './pages/ForgetPassword'
import Product from './pages/Product'
import Cart from './pages/Cart'
import AdminSale from './pages/admin/AdminSale'
import AddProduct from './pages/admin/AddProduct'
import AdminOrder from './pages/admin/AdminOrder'
import ShowUserOrders from './pages/admin/ShowUserOrders'
import AdminUser from './pages/admin/AdminUser'
import UserInfo from './pages/admin/UserInfo'
import AdminProduct from './pages/admin/AdminProduct'
import ProtectedRoute from './components/ProtectedRoute'
import Dashbord from './pages/Dashbord'
import Address from './pages/Address'
import SingleProduct from './pages/SingleProduct'

const router = createBrowserRouter([
  {
    path: '/',
    element: <><Navbar/><Home/></>
  },
  {
    path: '/signup',
    element: <><Signup/></>
  },
  {
    path: '/verify',
    element: <><Verify/></>
  },
  {
    path: '/verify/:token',
    element: <><VerifyEmail/></>
  },
  {
    path: '/reverify',
    element: <><Reverify/></>
  },
  {
    path: '/login',
    element: <><Login/></>
  },
  {
    path: '/products',
    element: <><Navbar/><Product/></>
  },
  {
    path: '/products/:id',
    element: <><Navbar/><SingleProduct/></>
  },
  {
    path: '/cart',
    element: <><ProtectedRoute><Navbar/><Cart/></ProtectedRoute></>
  },
  {
    path: '/profile/:id',
    element: <><ProtectedRoute><Profile/></ProtectedRoute></>
  },
  {
    path: '/forgot-password',
    element: <><ForgetPassword/></>
  },
  {
    path: '/address',
    element: <><ProtectedRoute><Navbar/><Address/></ProtectedRoute></>
  },
  {
    path: '/dashboard',
    element:<><ProtectedRoute adminOnly={true}><Navbar/><Dashbord/></ProtectedRoute></> ,
    children:[
      {
        path:"sales",
        element:<AdminSale/>
      },
      {
        path:"add-product",
        element:<AddProduct/>
      },
      {
        path:"orders",
        element:<AdminOrder/>
      },
      {
        path:"user/orders/:userId",
        element:<ShowUserOrders/>
      },
      {
        path:"users",
        element:<AdminUser/>
      },
      {
        path:"users/:id",
        element:<UserInfo/>
      },
      {
        path:"products",
        element:<AdminProduct/> 
      }
    ]
  }


])

function App() {


  return (
    <>
    <div>
    
        <RouterProvider router={router} />
   
     
    </div>

    </>
  )
}

export default App
