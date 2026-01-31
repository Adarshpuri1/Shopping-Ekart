import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setCart } from '@/redux/productSlice'
import { toast } from 'sonner'

const Cart = () => {
  const { cart } = useSelector(store => store.product)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const accessToken = localStorage.getItem('accessToken')

  const subtotal = cart?.totalPrice || 0
  const shipping = subtotal > 2000 ? 0 : 10
  const tax = Math.floor(subtotal * 0.05)
  const total = subtotal + tax + shipping

  // ✅ GET CART DATA
  const getAllData = async () => {
    try {
      const res = await axios.get(
        'http://localhost:8000/api/v1/cart/',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllData()
  }, [])

  // ✅ UPDATE QUANTITY
  const handleUpdateQuantity = async (productId, type) => {
    if (!productId) return

    try {
      const res = await axios.put(
        'http://localhost:8000/api/v1/cart/update',
        { productId, type },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error)
    }
  }

  // ✅ REMOVE ITEM
  const handleRemove = async productId => {
    if (!productId) return

    try {
      const res = await axios.delete(
        'http://localhost:8000/api/v1/cart/remove',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: { productId },
        }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {cart?.items?.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-7">
            Shopping Cart
          </h1>

          <div className="flex gap-7">
            {/* LEFT SIDE */}
            <div className="flex flex-col gap-5 flex-1">
              {cart.items
                .filter(item => item.productId !== null)
                .map((product, index) => (
                  <Card key={index}>
                    <div className="flex justify-between items-center pr-7">
                      <div className="flex items-center w-[350px]">
                        <img
                          src={product.productId.productImg?.[0]?.url}
                          alt=""
                          className="w-24 h-24"
                        />
                        <div className="w-[280px] p-4">
                          <h1 className="font-semibold truncate">
                            {product.productId.productName}
                          </h1>
                          <p>₹{product.productId.productPrice}</p>
                        </div>
                      </div>

                      <div className="flex gap-5 items-center">
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleUpdateQuantity(
                              product.productId._id,
                              'decrease'
                            )
                          }
                        >
                          -
                        </Button>

                        <span>{product.quantity}</span>

                        <Button
                          variant="outline"
                          onClick={() =>
                            handleUpdateQuantity(
                              product.productId._id,
                              'increase'
                            )
                          }
                        >
                          +
                        </Button>
                      </div>

                      <p className="p-2">
                        ₹
                        {product.productId.productPrice * product.quantity}
                      </p>

                      <p
                        onClick={() =>
                          handleRemove(product.productId._id)
                        }
                        className="flex text-red-500 items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </p>
                    </div>
                  </Card>
                ))}
            </div>

            {/* RIGHT SIDE */}
            <Card className="w-[400px]">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>₹{tax}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex space-x-2">
                    <Input placeholder="Promo Code" />
                    <Button variant="outline">Apply</Button>
                  </div>

                  <Button
                    onClick={() => navigate('/address')}
                    className="w-full bg-pink-600"
                  >
                    PLACE ORDER
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
          <ShoppingCart className="w-16 h-16 text-pink-600" />
          <h2 className="mt-6 text-2xl font-bold">Your Cart is Empty</h2>
          <Button
            onClick={() => navigate('/products')}
            className="mt-6 bg-pink-600"
          >
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  )
}

export default Cart
