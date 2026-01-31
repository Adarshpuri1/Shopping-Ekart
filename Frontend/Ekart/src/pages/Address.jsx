import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { addAddress } from '@/redux/productSlice'
import store from '@/redux/store'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Address = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  })

  const {cart, address, selectedAddress } = useSelector((store)=>store.product);
  const [showForm, setShowForm] = useState(address?.length > 0 ? false : true)
  const dispatch= useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector(store=>store.user.token);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  
  const handlesave = () => {
    dispatch(addAddress(formData))
    setShowForm(false)
  }

  const subtotal = cart.totalPrice
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = parseFloat((subtotal * 0.05).toFixed(2))
  const total = subtotal + shipping + tax

  const handlePayment = async () => {
    try{
      const {data} = await axios.post(`http://localhost:8000/api/v1/orders/create-order`,{
        products: cart?.items?.map(item=>({
          productId: item.productId._id,
          quantity: item.quantity
        })),
        tax,
        shipping,
        amount: total,
        Currency: "INR"
      },
      {
        headers:{ Authorization: `Bearer ${accessToken}`}
      }
    )

    console.log(data);
    if(!data.success) return toast.error("Something went wrong")

    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "Ekart",
        Description: "Order Payment",
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(`http://localhost:8000/api/v1/orders/verify`, response,
              {
                headers: { Authorization: `Bearer ${accessToken}` }
              }
            )
            if (verifyRes.data.success) {
              toast.success("✅ Payment Successfull!")
              dispatch(setCart({ items: [], totalPrice: 0 }))
              navigate("/order-success")
            }
            else {
              toast.error("❌ Payment Verification failed")
            }
          } catch (error) {
            
          }
        },
        modal: {
          ondismiss: async function () {
            await axios.post(`http://localhost:8000/api/v1/orders/verify`, {
              razorpay_order_id: data.order.id,
              paymentFailed: true
            }, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            toast.error("Payment Cancelled")
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: "#f47286" }
      };

      const rzp = new window.Razorpay(options)
      rzp.on("Payment.failed", async function (response) {
        await axios.post(`http://localhost:8000/api/v1/orders/verify`, {
          razorpay_order_id: data.order.id,
          paymentFailed: true
        }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        toast.error("Payment failed. Please try again")
      })
      rzp.open()

    }catch(error){
      console.error(error);
      toast.error("Something went wrong while processing payment")
    }
  }


  return(
    <div className='max-w-7xl mx-auto grid place-items-center p-10'>
      <div className='grid grid-cols-2 items-start gap-20 mt-10 max-w-7xl mx-auto'>
        <div className='space-y-4 p-6 bg-white'>
          {
            showForm ? (
              <>
                <div>
                  <Label htmlFor='fullName'>Full Name</Label>
                  <Input id="fullName"
                    name="fullName"
                    required
                    placeholder="john Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor='phone'>Phone Number</Label>
                  <Input id="phone"
                    name="phone"
                    required
                    placeholder="+91..."
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor='email'>Email</Label>
                  <Input id="email"
                    name="email"
                    required
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor='address'>Address</Label>
                  <Input id="address"
                    name="address"
                    required
                    placeholder="243 Street Area"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='city'>City</Label>
                    <Input id="city"
                      name="city"
                      required
                      placeholder="Dwarika"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor='state'>State</Label>
                    <Input id="state"
                      name="state"
                      required
                      placeholder="Delhi"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='zip'>Zip Code</Label>
                    <Input id="zip"
                      name="zip"
                      required
                      placeholder="11441"
                      value={formData.zip}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor='country'>Country</Label>
                    <Input id="country"
                      name="country"
                      required
                      placeholder="India"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <Button onClick={handlesave} className='w-full'>Save & Continue</Button>
              </>
            ) : (
              <div className='space-y-4 '>
                <h2 className='text-lg font-semibold'>Saved Address</h2>
                {
                  address?.map((addr, index) => {
                    return <div key={index}
                      onClick={() => dispatch(setSelectedAddress(index))} className={`border p-4 rounded-md cursor-pointer relative ${selectedAddress === index ? "border-pink-600 bg-pink-50" : "border-gray-300"}`}>
                      <p className='font-medium'>{addr.fullName}</p>
                      <p>{addr.phone}</p>
                      <p>{addr.email}</p>
                      <p>{addr.address},{addr.city},{addr.state},{addr.zip},{addr.country}</p>
                      <button onClick={(e) => dispatch(deleteAddress(index))} className='absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm'>
                        Delete
                      </button>
                    </div>

                  })
                }
                <Button variant='outline' className='w-full' onClick={() => setShowForm(true)}>+ Add New Address</Button>
                <Button disabled={selectedAddress === null}
                onClick={handlePayment}
                  className='w-full bg-pink-600'>
                  Procced To Checkout
                </Button>
              </div>
            )
          }
        </div>
        <div>
          <Card className='w-[400px]'>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className='flex justify-between'><span>Subtotal ({cart.items.length}) items</span>
                <span>{subtotal.toLocaleString("en-IN")
                }</span>
              </div>
              <div className='flex justify-between'><span>Shipping </span>
                <span>₹{subtotal.toLocaleString("en-IN")
                }</span>
              </div>

              <div className='flex justify-between'><span>Tax </span>
                <span>₹{tax}</span>
              </div>
              <Separator className='my-3' />
              <div className='flex justify-between font-bold text-lg'><span>Total </span>
                <span>₹{total}</span>
              </div>

              <div className='text-sm text-muted-foreground pt-4'>
                <p>* Free shipping on orders over 299</p>
                <p>* 30-days return policy</p>
                <p>* Secure Checkout with SSL encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Address
