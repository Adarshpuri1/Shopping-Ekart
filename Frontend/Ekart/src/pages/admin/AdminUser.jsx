import { Input } from '@/components/ui/input'
import axios from 'axios'
import { Edit, Eye, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import userlogo from '../../assets/userlogo.png'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const AdminUser = () => {
  const accessToken=localStorage.getItem("accessToken")
  const[users,setUsers]=useState([])
  const[searchTerm,setSearchTerm]=useState('')
  const navigation=useNavigate()

  const getAllUser =async()=>{
    try{
      const res=await axios(`http://localhost:8000/api/v1/user/all-user`,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      if(res.data.success){
        setUsers(res.data.Users)
      }
    }catch(error){
      console.log(error)
    }
  }

  const filteredUsers =users.filter(user=>
    
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(()=>{
    getAllUser()
  },[])
  return (
    <div className='pl-[350px] py-20 pr-20 mx-aauto px-4'>
        <h1 className='font-bold text-2xl'>User Mangement</h1>
        <p>View and manage users</p>
        <div className='flex relative w-[300px] mt-6'>
          <Search className='absolute left-2 top-1 text-gray-600 w-5'/>
          <Input className="pl-10" placeholder="Search Users.." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
        </div>
      <div className='grid grid-cols-3 gap-7 mt-7'>
        {
          filteredUsers.map((user)=>{
            return <div className='bg-pink-100 p-5 rounded-lg'>
              <div className='flex items-center gap-2'>
                 <img src={user?.profilepic  || userlogo} alt='' className='rounded-full w-16 aspect-square 
                 object-cover border-pink-600 '/>
                 <div>
                  <h1 className='font-semibold'>{user?.firstName} {user?.lastName}</h1>
                  <h3>{user?.email}</h3>
                 </div>
              </div>
              <div className='flex gap-3 mt-3'>
                <Button onClick={()=>navigation(`/dashboard/users/${user?._id}`)} variant='outline'><Edit/>Edit</Button>
                <Button onClick={()=>navigation(`/dashboard/users/orders/${user?._id}`)}><Eye/>Show Order</Button>
                </div>
            </div>
          })
        }
      </div>
    </div>
  )
}

export default AdminUser
