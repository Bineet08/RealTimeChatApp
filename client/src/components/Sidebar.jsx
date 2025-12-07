import React from 'react'
import { useNavigate } from 'react-router'

const Sidebar = ({selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <img src='#' alt='logo' className='max-w-40'></img>
          <div className='relative py-2 group'>
            <img src="#" alt='Menu' className='max-h-5 cursor-pointer'></img>
            <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
            <hr className='my-2 border-t border-gray-500'></hr>
            <p className='cursor-pointer text-sm'>Logout</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar