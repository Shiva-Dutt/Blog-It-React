import React from 'react'

function Button({
    children,
    type = 'button',
    bgColor = "",
    textColor = "",
    className = "",
    ...props
}) {
  return (
    <div>
      <button className={`px-2 py-2 ${className} ${bgColor} ${textColor}`} type= {type} {...props}>
      {children}
      </button>
    </div>
  )
}

export default Button
