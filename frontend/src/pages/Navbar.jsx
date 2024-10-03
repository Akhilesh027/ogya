import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaUser, FaSearch } from 'react-icons/fa';
import './Navbar.css';
import CartDrawer from './CartPage';
import logo from '../pages/Images/logo1.png'
const Navbar = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Authentication state
    const [isSearchOpen, setIsSearchOpen] = useState(false); // Search bar visibility
    const navigate = useNavigate();

    // Check if the user is logged in on component mount
    useEffect(() => {
        const token = localStorage.getItem('token'); // Replace with your token retrieval logic
        setIsLoggedIn(!!token);
    }, []);

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token
        setIsLoggedIn(false); // Update the state
        navigate('/login'); // Redirect to the login page
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false); // Close the menu when a link is clicked
    };

    return (
        <>
            <nav id='navbar' className="navbar">
                <div className="hamburger">
                    <FaBars size={25} onClick={toggleMenu} />
                </div>
                <div className="logo">
                    <Link to="/">
                        <img src={logo} alt="logo" />
                    </Link>
                </div>
                <div className="mcart">
                <Link onClick={toggleCart} id='cart'>
                            <FaShoppingCart size={20} />
                        </Link>
                </div>
                <div className={`links ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="link" onClick={closeMenu}>Home</Link>
                    <Link to="/about" className="link" onClick={closeMenu}>About</Link>
                    <Link to="/product" className="link" onClick={closeMenu}>Product</Link>
                    <Link to="/contact" className="link" onClick={closeMenu}>Contact</Link>
                </div>
               <div>
               <ul className={`navLinks ${isMenuOpen ? 'active' : ''}`}>
                    <li>
                        <Link onClick={toggleCart} id='cart'>
                            <FaShoppingCart size={20} />
                        </Link>
                        <Link onClick={toggleSearch} className="link">
                            <FaSearch size={20} />
                        </Link>
                        {isSearchOpen && (
                            <div className="search-bar">
                                <input type="text" placeholder="Search..." />
                            </div>
                        )}
                        {isLoggedIn ? (
                            <>
                                {/* <Link className="link" to="/profile">
                                    <FaUser size={20} />
                                </Link> */}
                                <button className="loginbtn" onClick={handleLogout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link className='link' to='/login'>
                                <button className='loginbtn'>Login</button>
                            </Link>
                        )}
                    </li>
                </ul>
               </div>
               
            </nav>
            <CartDrawer isOpen={isCartOpen} onClose={toggleCart} />
        </>
    );
};

export default Navbar;
