import FilterSidebar from '@/components/filterSidebar'
import React, { useEffect, useState } from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'
import Productcart from '@/components/Productcart'

const Product = () => {

  // =========================
  // LOCAL STATES
  // =========================
  const [allProduct, setAllProduct] = useState([])   // original product list
  const [loading, setLoading] = useState(false)

  const [priceRange, setPricerange] = useState([0, 9999999])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [brand, setBrand] = useState("All")
  const [sortOrder, setSortOrder] = useState("")

  // =========================
  // REDUX
  // =========================
  const { products } = useSelector(state => state.product)
  const dispatch = useDispatch()

  // =========================
  // FETCH PRODUCTS
  // =========================
  const getAllData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        "http://localhost:8000/api/v1/product/getallproducts"
      )

      if (res.data.success) {
        setAllProduct(res.data.Products)              // store original data
        dispatch(setProducts(res.data.Products))     // show all products initially
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // FILTER + SORT LOGIC
  // =========================
  useEffect(() => {
    if (allProduct.length === 0) return

    let filtered = [...allProduct]

    // 🔍 Search filter
    if (search.trim() !== "") {
      filtered = filtered.filter(p =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      )
    }

    // 📂 Category filter
    if (category !== "All") {
      filtered = filtered.filter(p => p.category === category)
    }

    // 🏷 Brand filter
    if (brand !== "All") {
      filtered = filtered.filter(p => p.brand === brand)
    }

    // 💰 Price filter (FIXED: convert price to number safely)
    filtered = filtered.filter(p => {
      const price = Number(p.productPrice)
      return !isNaN(price) &&
        price >= priceRange[0] &&
        price <= priceRange[1]
    })

    // ↕ Sorting
    if (sortOrder === "lowtoHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice)
    } else if (sortOrder === "hightoLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice)
    }

    // ✅ Update Redux with filtered products
    dispatch(setProducts(filtered))

  }, [search, category, brand, priceRange, sortOrder, allProduct, dispatch])

  // =========================
  // INITIAL API CALL
  // =========================
  useEffect(() => {
    getAllData()
  }, [])

  // =========================
  // UI
  // =========================
  return (
    <div className="pt-25 pb-10">
      <div className="max-w-7xl mx-auto flex gap-7">

        {/* FILTER SIDEBAR */}
        <FilterSidebar
          allProduct={allProduct}
          priceRange={priceRange}
          setPricerange={setPricerange}
          category={category}
          setCategory={setCategory}
          brand={brand}
          setBrand={setBrand}
          search={search}
          setSearch={setSearch}
        />

        {/* PRODUCT LIST */}
        <div className="flex flex-col flex-1">

          {/* SORT DROPDOWN (FIXED: onValueChange added) */}
          <div className="flex justify-end mb-4">
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="lowtoHigh">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="hightoLow">
                    Price: High to Low
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
            {allProduct.map(product => (
              <Productcart
                key={product._id}
                product={product}
                loading={loading}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Product
