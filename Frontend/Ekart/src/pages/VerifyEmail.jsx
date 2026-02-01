import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const VerifyEmail = () => {
    const navigate= useNavigate();
    const {token}=useParams();
    const[status,setStatus]=useState("verifying.....");
    const VerifyEmails=async()=>{
        try{
            const res=await axios.post(`https://shopping-ekart-backend.onrender.com/api/v1/user/verify`,{},{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            if(res.data.success){
                setStatus('✅ Email Verified Successfully')
                setTimeout(() => {
                    navigate('/login')
                },2000);
            }

        }catch(error){
            console.log(error);
            setStatus("❌ verification failed, Please try again");
        }
    }

    useEffect(()=>{
        VerifyEmails()
    },[token])
  return (
    <div className='relative w-full h-[760px] bg-pink-100 overflow-hidden'>
        <div className='min-h-screen flex items-center justify-center'>
            <div className='bg-white p-6 rounded-2xl shadow-md text-center w-[90%] max-w-md'>
                <h2 className='text-xl font-semibold text-gray-800'>{status}</h2>
            </div>
        </div>
      
    </div>
  )
}

export default VerifyEmail
