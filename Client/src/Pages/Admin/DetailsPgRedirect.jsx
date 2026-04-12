import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const DetailsPgRedirect = () => {
  const navigate = useNavigate()
  const {isAuthenticated} = useSelector(state=>state.user)

   useEffect(() => {
      if (isAuthenticated) {
        navigate("/");
      }})
  return (
    <div>DetailsPgRedirect</div>
  )
}

export default DetailsPgRedirect