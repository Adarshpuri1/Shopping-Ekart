import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-dropdown-menu'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const ForgetPassword = () => {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate=useNavigate()


    const handleEmail = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await axios.post(`https://shopping-ekart-backend.onrender.com/api/v1/user/forget-password`, { email: email }, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.data.success) {
                toast.success(res.data.message)
                setStep(2);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message)
        }
        finally{
            setLoading(false)
        }

    }

    const handleOTP = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await axios.post(`https://shopping-ekart-backend.onrender.com/api/v1/user/verify-otp/${email}`,{otp: otp}, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.data.success) {
                toast.success(res.data.message);
                setStep(3)
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message)
        }
        finally{
            setLoading(false)
        }
    }


    const handlePassword = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await axios.post(`https://shopping-ekart-backend.onrender.com/api/v1/user/change-password/${email}`, {
                newPassword: newPassword,
                confirmPassword: confirmPassword
            },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
        if(res.data.success){
            toast.success(res.data.message);
            navigate('/login');
        }

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message)
        }
        finally{
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {step === 1 &&
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-semibold text-slate-800">
                            Forgot Password
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                            Enter your email to receive an OTP
                        </p>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleEmail} className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-1">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Send OTP Button */}
                            <button
                                type="submit"
                                disabled={loading} // disable button while loading
                                className={`w-full py-2 rounded text-white ${loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'}`}
                            >
                                {loading ? (
                                    <div className="flex justify-center items-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Sending...
                                    </div>
                                ) : (
                                    "Send OTP"
                                )}
                            </button>
                        </form>
                    </CardContent>
                </Card>
            }
            {step === 2 &&
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-semibold text-slate-800">
                            Verify Otp
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                            Enter your Otp to receive on email
                        </p>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleOTP} className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-1">
                                <Label htmlFor="email">Otp</Label>
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="enter your otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Send OTP Button */}
                            <button
                                type="submit"
                                disabled={loading} // disable button while loading
                                className={`w-full py-2 rounded text-white ${loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'}`}
                            >
                                {loading ? (
                                    <div className="flex justify-center items-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Veryfing...
                                    </div>
                                ) : (
                                    "Verify"
                                )}
                            </button>
                        </form>
                    </CardContent>
                </Card>
            }
            {step === 3 &&
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-semibold text-slate-800">
                            Change Password
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                            Change Your Password
                        </p>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handlePassword} className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-1">
                                <Label htmlFor="nemail">New Password</Label>
                                <Input
                                    id="nemail"
                                    type="text"
                                    placeholder="newPassword"
                                    value={newPassword}
                                    onChange={(e)=>setNewPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="cemail">Confirm Password</Label>
                                <Input
                                    id="cemail"
                                    type="text"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e)=>setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Send OTP Button */}
                            <button
                                type="submit"
                                disabled={loading} // disable button while loading
                                className={`w-full py-2 rounded text-white ${loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'}`}
                            >
                                {loading ? (
                                    <div className="flex justify-center items-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        process....
                                    </div>
                                ) : (
                                    "change password"
                                )}
                            </button>
                        </form>
                    </CardContent>
                </Card>
            }
        </div>
    )
}

export default ForgetPassword
