import Ordercard from '@/components/Ordercard';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ShowUserOrders = () => {
  const params=useParams()
  const[userOrder,setUserOrder] =  useState(null);
  const accessToken = localStorage.getItem("accessToken");

  const getUserOrders =async()=>{
    const res= await axios.get(`http://localhost:8000/api/v1/orders/user-order/${params.userId}`,{
      headers:{
        Authorization:  `Bearer ${accessToken}`
      }
    })
    if(res.data.success){
      setUserOrder(res.data.orders)
    }
  }

  useEffect(()=>{
    getUserOrders()
  },[])
   
  return (
    <div className='pl-[350px] py-20'>
      <Ordercard userOrder={userOrder}/>
    </div>
  )
}

export default ShowUserOrders
