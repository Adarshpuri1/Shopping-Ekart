import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { setToken, setUser } from '@/redux/userSlice'
import { Label } from '@radix-ui/react-dropdown-menu'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Login = () => {
    const [formdata, setFormData] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`https://shopping-ekart-backend.onrender.com/api/v1/user/login`, formdata, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.data.success) {
                toast.success("User log in Successfully");
                dispatch(setUser(res.data.user));
                dispatch(setToken(res.data.accessToken))
                localStorage.setItem("accessToken", res.data.accessToken)
                
                navigate('/')


            }

        } catch (error) {
            console.log(error);

            toast.error(error.response?.data?.message)
            // if(error.response?.data?.message === "verify first"){
            //     navigate('/reverify');
            //     return;
            // }
            if (error.response?.data?.message === "verify first ") {
                navigate('/reverify');
            }

        }

    }


    return (
        <div>
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





                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={formdata.email}
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
                                        placeholder="Enter a Password"
                                        type="password"
                                        required
                                        value={formdata.password}
                                        onChange={handleChange}


                                    />

                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3 pt-2">
                        {/* Login Button */}
                        <Button
                            onClick={submitHandler}
                            type="submit"
                            className="w-full cursor-pointer hover:bg-gray-700 transition"
                        >
                            Login
                        </Button>

                        {/* Forgot Password - right aligned */}
                        <div className="w-full text-right">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center w-full gap-2 text-gray-400 text-xs">
                            <span className="flex-1 h-px bg-gray-300"></span>
                            OR
                            <span className="flex-1 h-px bg-gray-300"></span>
                        </div>

                        {/* Signup */}
                        <p className="text-sm text-gray-700 text-center">
                            Don&apos;t have an account?{" "}
                            <Link
                                to="/signup"
                                className="font-medium text-pink-700 hover:text-pink-900 hover:underline transition"
                            >
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default Login
