import React from 'react'
import { Link } from 'react-router-dom'
import './navbar.css'
const Navbar = () => {
  return (
    <div className='navbar'>
        <Link to='/' className='admin-link'>Dashboard</Link>
        <Link to='/productPost' className="admin-link">Product Post</Link>
        <Link to='/manageProducts' className="admin-link">Manage Products</Link>
        <Link to='/viewOrders' className="admin-link">View Orders</Link>
        <Link to='/manageorders' className="admin-link">Manage Orders</Link>
    
    </div>
  )
}

export default Navbar
