import store from '@/redux/store'
import { setUser } from '@/redux/userSlice'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import logo from '../assets/userlogo.png'
import MyOrder from './MyOrder'


const Profile = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null);
  const [formdata, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    profilepic: "",
  })
  const user = useSelector(store => store.user.user);
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNo: user.phoneNo || "",
        address: user.address || "",
        city: user.city || "",
        zipCode: user.zipCode || "",
        profilepic: user.profilepic || "",
      });
    }
  }, [user]);


  const changeValue = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFile = (e) => {
    const selectFile = e.target.files[0];
    if (!selectFile) return;
    setFile(selectFile)
    setFormData({
      ...formdata,
      profilepic: URL.createObjectURL(selectFile)
    })
  }



  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("firstName", formdata.firstName);
    form.append("lastName", formdata.lastName);
    form.append("phoneNo", formdata.phoneNo);
    form.append("address", formdata.address);
    form.append("city", formdata.city);
    form.append("zipCode", formdata.zipCode);

    if (file) {
      form.append("file", file); //must match multer field
    }

    try {
      setLoading(true)
      const res = await axios.put(`http://localhost:8000/api/v1/user/update/${id}`, form, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user))
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-200">
      <Tabs defaultValue="Profile" className="max-w-5xl mx-auto">
        <TabsList className='pl-120 text-2xl font-bold'>
          <TabsTrigger value="Profile">Profile </TabsTrigger>
          || 
          <TabsTrigger value="Orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="Profile">
          <div className="flex flex-col items-center bg-gray-100 p-6">
            <h1 className="font-bold mb-7 text-2xl">Update Profile</h1>

            <div className="flex gap-10 w-full max-w-3xl">
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <img
                  src={formdata.profilepic || logo}
                  alt="profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-pink-700"
                />
                <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
                  Change Picture
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFile}
                  />
                </Label>
              </div>

              {/* Form */}
              <form
                onSubmit={handleUpdate}
                className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-full"
              >
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="firstName"
                    placeholder="First Name"
                    value={formdata.firstName}
                    onChange={changeValue}
                    className="border px-3 py-2 rounded"
                  />
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    value={formdata.lastName}
                    onChange={changeValue}
                    className="border px-3 py-2 rounded"
                  />
                </div>

                <input
                  value={user.email}
                  disabled
                  className="border px-3 py-2 rounded bg-gray-100 w-full"
                />

                <input
                  name="phoneNo"
                  placeholder="Phone Number"
                  value={formdata.phoneNo}
                  onChange={changeValue}
                  className="border px-3 py-2 rounded w-full"
                />

                <input
                  name="address"
                  placeholder="Address"
                  value={formdata.address}
                  onChange={changeValue}
                  className="border px-3 py-2 rounded w-full"
                />

                <input
                  name="city"
                  placeholder="City"
                  value={formdata.city}
                  onChange={changeValue}
                  className="border px-3 py-2 rounded w-full"
                />

                <input
                  name="zipCode"
                  placeholder="Zip Code"
                  value={formdata.zipCode}
                  onChange={changeValue}
                  className="border px-3 py-2 rounded w-full"
                />

                <button
                  type="submit"
                  className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
                >
                  {loading ? "updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="Orders">
          <MyOrder/>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Profile
