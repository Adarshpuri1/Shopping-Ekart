import React from 'react'
import { Link } from 'react-router-dom'
import {FaFacebook, FaInstagram, FaTwitterSquare, FaPinterest } from "react-icons/fa"
import logo from '../assets/logo.jpg'

const Footer = () => {
  return (
    <div>
       <footer className="bg-gray-900 text-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4 md:flex md:justify-between">

        {/* LEFT SECTION */}
        <div className="mb-6 md:mb-0">
          <img src={logo} alt="logo" className="w-32" />

          <p className="mt-2 text-sm">
            Powering Your World with the Best in Electronics.
          </p>

          <p className="mt-2 text-sm">
            123 Electronics St, Style City, NY 10001
          </p>

          <p className="text-sm">Email: support@2kpro.com</p>
          <p className="text-sm">Phone: (123) 456-7890</p>
        </div>

        {/* CUSTOMER SERVICE */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold">Customer Service</h3>
          <ul className="mt-2 text-sm space-y-2">
            <li>Contact Us</li>
            <li>Shipping & Returns</li>
            <li>FAQs</li>
            <li>Order Tracking</li>
            <li>Size Guide</li>
          </ul>
        </div>

        {/* SOCIAL MEDIA */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold">Follow Us</h3>
          <div className="flex space-x-4 mt-2 text-2xl">
            <FaFacebook />
            <FaInstagram />
            <FaTwitterSquare />
            <FaPinterest />
          </div>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-xl font-semibold">Stay in the Loop</h3>
          <p className="mt-2 text-sm">
            Subscribe to get special offers, free giveaways, and more.
          </p>

          <form className="mt-4 flex">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full p-2 bg-white rounded-l-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button
              type="submit"
              className="bg-pink-600 text-white px-4 rounded-r-md hover:bg-red-700"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>

      {/* BOTTOM COPYRIGHT SECTION */}
      <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm">
        © {new Date().getFullYear()} 
        <span className="text-pink-600"> Ekart</span>. All rights reserved.
      </div>
    </footer>
    </div>
  )
}

export default Footer
