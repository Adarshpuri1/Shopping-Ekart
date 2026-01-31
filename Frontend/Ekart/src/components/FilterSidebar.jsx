import React from 'react'
import { Button } from './ui/button';

const FilterSidebar = ({search,setSearch,category,setCategory,brand,setBrand, setPricerange, allProduct,priceRange }) => {
  const Categories = allProduct.map(p => p.category)
  const UniqueCategory = ["All", ...new Set(Categories)]
  const Brands = allProduct.map(p => p.brand);
  const UniqueBrand = ["All", ...new Set(Brands)]
  const handleCategoryClick=(val)=>{
    setCategory(val)
  }
  const handleBrandChange=(e)=>{
    setBrand(e.target.value)
  }
  const handleMinChange=(e)=>{
    const value= Number(e.target.value)
    if(value <= priceRange[1]) setPricerange([value, priceRange[1]])
  }
  const handleMaxChange=(e)=>{
    const value= Number(e.target.value)
    if(value >= priceRange[0]){
       setPricerange([priceRange[0],value])
    }
  }
const resetFilter=()=>{
  setSearch("");
  setBrand("All");
  setCategory("All");
  setPricerange([0,999999]);
}
  return (
    <div className="mt-10 rounded-md hidden md:block w-64">
      {/* Search */}
      <p className="font-semibold mb-2">Search</p>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="p-2 rounded-md w-full border border-gray-400"
      />

      {/* Category */}
      <h1 className="mt-4 font-semibold text-xl">Category</h1>

      <div className="flex flex-col gap-2 mt-2">
        {UniqueCategory.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input type="radio" name="category" checked={category === item} onChange={()=>handleCategoryClick(item)} />
            <label>{item}</label>
          </div>
        ))}
      </div>
      {/* Brand */}
      <h1 className="mt-4 font-semibold text-xl">Brand</h1>
        <select className='bg-white w-full p-2 border-gray-200 border-2 rounded-md' value={brand} onChange={handleBrandChange}>
          {
            UniqueBrand.map(((item,index)=>{
              return <option key={index} value={item}>{item.toUpperCase()}</option>
            }))
          }
        </select>
          {/* Price range */}
          <h1 className='mt-5 font-semibold text-xl mb-3'>Price Range</h1>
          <div className='flex flex-col gap-2'>
            <label>
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
            </label>
            <div className=' flex gap-2 items-center'> 
              <input type='number' min='0'  max='5000' value={priceRange[0]} onChange={handleMinChange} className='w-20 p-1 border border-gray-300 rounded'/>
              <input type='number' min='0'  max='99999'  value={priceRange[1]}  onChange={handleMaxChange} className='w-20 p-1 border border-gray-300 rounded'/>
            </div>
            <input type='range' min='0' max='5000' step='100' className='w-full' value={priceRange[0]} onChange={handleMinChange}/>
            <input type='range' min='0' max='99999' step='100' className='w-full' value={priceRange[1]}  onChange={handleMaxChange}/>
          </div>
          {/* Reset button */}
          <Button onClick={resetFilter} className='bg-pink-600 text-white mt-5 cursor-pointer w-full'>Reset Filters</Button>
    </div>

  )
}

export default FilterSidebar
