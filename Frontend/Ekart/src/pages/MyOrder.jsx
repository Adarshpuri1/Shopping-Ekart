import Ordercard from '@/components/Ordercard';
import store from '@/redux/store';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const MyOrder = () => {
    const [userOrder,setUserOrder] = useState([]);
    const accessToken= localStorage.getItem("accessToken")
    
    const getUserOrders= async ()=> {
        try{
            const res= await axios.get(`http://localhost:8000/api/v1/orders/my-order`,{
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if(res.data.success){
                setUserOrder(res.data.orders);
            }

        }catch(error){
            console.log(error)
        }
    }
     useEffect(()=>{
        getUserOrders()
     },[])
  return (
    <div>
      <Ordercard userOrder={userOrder}/>
    </div>
  )
}

export default MyOrder
