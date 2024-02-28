import React from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const handleLogout = () => {
        authService.logout()
            .then(() => {
                dispatch(logout())
            })
    }
  return (
    <div>
      <button className='py-2 px-5 text-black button-custom rounded-xl shadow-lg duration-200 hover:drop-shadow-2xl hover:shadow-[#666666] hover:cursor-pointer' onClick={() => handleLogout()}>Logout</button>
    </div>
  )
}

export default LogoutBtn
