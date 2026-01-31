import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Reverify = () => {
    const [email,setEmail]=useState("")
    const navigate=useNavigate()

    const handlesubmit=async()=>{
        try{
            const res=await axios.post(`http://localhost:8000/api/v1/user/reverify`,{email: email},{
                headers:{
                    "Content-Type":"application/json"
                }
            })
        if(res.data.success){
            toast.success(res.data.message)
            navigate('/verify')
        }
            
        }catch(error){
            console.error(error)
            toast.error(error.response?.data?.message)
        }
    }
  return (
    <div className='relative w-full h-[760px] overflow-hidden'>
        <div className=' min-h-screen flex items-center justify-center bg-pink-100 px-4'>
            <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center'>
                <h2 className='text-2xl font-semibold text-green-500 mb-4'>Email for reverify</h2>
                <Input type="email" placeholder="enter your email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <Button onClick={handlesubmit} className="w-full cursor-pointer hover:bg-gray-700 transition m-2">Send</Button>

            </div>
        </div>

    </div>
  )
}

export default Reverify
