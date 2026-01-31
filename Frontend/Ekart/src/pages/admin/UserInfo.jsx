import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userlogo from '../../assets/userlogo.png'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useDispatch } from 'react-redux'
import axios from 'axios'

import { toast } from 'sonner'
import { setUser } from '@/redux/userSlice'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const UserInfo = () => {
  const navigate = useNavigate()
  const { id: userId } = useParams()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)

  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    profilepic: "",
    role: "user",
  })

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setUpdateUser(prev => ({ ...prev, [name]: value }))
  }

  // 🔹 Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setUpdateUser(prev => ({
      ...prev,
      profilepic: URL.createObjectURL(selectedFile),
    }))
  }

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    const accessToken = localStorage.getItem("accessToken")

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("firstName", updateUser.firstName)
      formData.append("lastName", updateUser.lastName)
      formData.append("phoneNo", updateUser.phoneNo)
      formData.append("address", updateUser.address)
      formData.append("city", updateUser.city)
      formData.append("zipCode", updateUser.zipCode)
      formData.append("role", updateUser.role)

      if (file) {
        formData.append("file", file)
      }

      const res = await axios.put(
        `http://localhost:8000/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Fetch user details
  const getUserDetails = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/get-user/${userId}`
      )

      if (res.data.success) {
        setUpdateUser(res.data.user)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [userId])

  return (
    <div className="pt-5 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="flex gap-10 items-center mb-6">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>
          <h1 className="font-bold text-2xl">Update Profile</h1>
        </div> 
        <div className="flex gap-10 w-full max-w-3xl">
          {/* Profile image */}
          <div className="flex flex-col items-center">
            <img
              src={updateUser.profilepic || userlogo}
              alt="profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-pink-700"
            />
            <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
              Change Picture
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Label>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-full"
          >
            <div className="grid grid-cols-2 gap-4">
              <Input name="firstName" value={updateUser.firstName} onChange={handleChange} placeholder="First Name" />
              <Input name="lastName" value={updateUser.lastName} onChange={handleChange} placeholder="Last Name" />
            </div>

            <Input value={updateUser.email} disabled className="bg-gray-100" />

            <Input name="phoneNo" value={updateUser.phoneNo} onChange={handleChange} placeholder="Phone Number" />
            <Input name="address" value={updateUser.address} onChange={handleChange} placeholder="Address" />
            <Input name="city" value={updateUser.city} onChange={handleChange} placeholder="City" />
            <Input name="zipCode" value={updateUser.zipCode} onChange={handleChange} placeholder="Zip Code" />

            <div className="flex items-center gap-4">
              <Label>Role:</Label>
              <RadioGroup
                value={updateUser.role}
                onValueChange={(value) =>
                  setUpdateUser(prev => ({ ...prev, role: value }))
                }
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user">User</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">Admin</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full bg-pink-600">
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserInfo
