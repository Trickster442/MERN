import React from 'react'
import '../styles/notFound.css'
import { Link } from 'react-router-dom'
const NotFound = () => {
  return (
    <div className='notFound'>
      <h2 className='notFound-text'> Not Found !!!</h2>
      <p className='notFound-home'>Page not found <span>Go to home page <Link to='/'>Here</Link></span></p>
    </div>
  )
}

export default NotFound
