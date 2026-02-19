import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Signup = () => {
    const [user,setUser]=useState({
        firstName:"",
        lastName:"",
        email:"",
        password:""
    })
    const navigate=useNavigate();

    const handleChange=(e)=>{
        const{name,value}=e.target;
        setUser((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const SubmitHandler=async(e)=>{
        e.preventDefault();

        try{
            const res= await axios.post(`https://shopping-ekart-backend.onrender.com/api/v1/user/register`,user,{
                headers:{
                    "Content-Type":"application/json"
                }
            })
            if(res.data.success){
                toast.success(res.data.message)
                navigate('/login');
            }

        }catch(error){
            console.log(error)
            toast.error(error.response?.data?.message)
        }
    }
  return (
    <div className='flex justify-center items-center min-h-screen bg-pink-100'>
      <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Enter given details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
       
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
                <div className='grid gap -2'>
                    <Label htmlFor="firstName">firstName</Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Jhon"
                        required
                        value={user.firstName}
                        onChange={handleChange}

                        
            
              />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor="lastName">lastName</Label>
                    <Input
                        id="lastName"
                        name="lastName"
                        type="text" 
                        placeholder="doe"
                        required
                        value={user.lastName}
                        onChange={handleChange}
                        
              />
              </div>
                </div>
                <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={user.email}
                onChange={handleChange}
               
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className='relative'>
                <Input id="password"  
                name="password" 
                placeholder="Create a Password"
                type="password"
                required 
                value={user.password}
                onChange={handleChange}
               
                />
                 
              </div>
            </div>
          </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={SubmitHandler}  type="submit" className="w-full cursor-pointer hover:bg-pink-300 bg-pink-600">
         Signup
        </Button>
        <p className='text-gray-700 text-sm'>Already have an account? <Link to={'/Login'} className="hover: underline cursor-pointer text-pink-800">Login</Link></p>
      </CardFooter>
    </Card>
    </div>
  )
}

export default Signup
