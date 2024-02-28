import React from 'react'
import logo from "/blogit-logo.png"
function Logo({width = '100px'}) {
  return (
    <div className='border-white  rounded-sm'><img src={logo} width={width} alt="" /></div>
  )
}

export default Logo
