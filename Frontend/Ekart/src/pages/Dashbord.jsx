import SideBar from '@/components/SideBar'
import { Sidebar } from 'lucide-react'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Dashbord = () => {
  return (
    <div className='flex pt-20'>
        <SideBar/>
      <div className='flex-1'>
        <Outlet/>
      </div>
    </div>
  )
}

export default Dashbord
