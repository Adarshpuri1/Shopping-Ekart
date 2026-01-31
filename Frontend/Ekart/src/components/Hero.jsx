import React from 'react'
import { Button } from './ui/button'
import img1 from '../assets/pic1.webp'
import { useNavigate } from 'react-router-dom'


const Hero = () => {
  const navigate = useNavigate();
   
  return (
     <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT TEXT */}
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Latest Electronics at Best Prices
          </h1>

          <p className="text-lg md:text-xl mb-6 text-blue-100">
            Discover cutting-edge technology with unbeatable deals on smartphones, laptops and more.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={()=>navigate('/products')}  className="bg-white text-blue-600 hover:bg-gray-200">
              Shop Now
            </Button>

            <Button 
              variant="outline" 
              onClick={()=>navigate('/products')}
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              View Deals
            </Button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center relative p-10">
          <img
            src={img1}
            alt="Electronics"
            className="w-[300px]  md:w-[500px] h-[450px] md:h-[500px] rounded-xl shadow-2xl"
          />
        </div>

      </div>
    </section>
  )
}

export default Hero
