import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaUser, FaSearch, FaTimes } from 'react-icons/fa'; // Import FaTimes icon
import './Navbar.css';
import CartDrawer from './CartPage';
import logo from '../pages/Images/logo1.png';

const Navbar = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Authentication state
    const [isSearchOpen, setIsSearchOpen] = useState(false); // Search bar visibility
    const [searchSuggestions, setSearchSuggestions] = useState([]); // Search suggestions

    const navigate = useNavigate();

    // Search suggestions array
    const suggestions = [
        { name: 'Mogra', link: '/product/24' },
        { name: 'Lavender', link: '/product/21' },
        { name: 'Jasmine', link: '/product/23' },
        { name: 'Rose', link: '/product/22' }
    ];
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
        if (!isSearchOpen) {
            setSearchSuggestions(suggestions); // Display suggestions when search is opened
        } else {
            setSearchSuggestions([]); // Hide suggestions when search is closed
        }
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
                    <Link onClick={toggleSearch} className="link">
                        <FaSearch color='white' size={20} />
                    </Link>
                    {isLoggedIn ? (
                        <>
                            <FaUser color="white" size={20} />
                        </>
                    ) : (
                        <Link className='link' to='/login'>
                            <button className='loginbtn'>Login</button>
                        </Link>
                    )}
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
                            <Link onClick={toggleSearch} className="link" id='search'>
                                <FaSearch size={20} />
                            </Link>
                            
                            {isLoggedIn ? (
                                <>
                                    <button id='search' className="loginbtn" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link className='link' id='search' to='/login'>
                                    <button className='loginbtn'>Login</button>
                                </Link>
                            )}
                        </li>
                    </ul>
                    {isSearchOpen && (
                           <>
                                <div className="search-bar">
                                    <input type="text" placeholder="Search..." />
                                    <FaTimes className="close-icon" size={20} onClick={toggleSearch} />
                                </div>
                                    <div className="search-suggestions">
                                        {searchSuggestions.map((suggestion, index) => (
                                            <div key={index} className="suggestion-item">
                                                <Link className='sLink' to={suggestion.link}>{suggestion.name}</Link>
                                            </div>
                                        ))}
                                    </div>
                             </>
                            )}
                </div>
            </nav>
            <CartDrawer isOpen={isCartOpen} onClose={toggleCart} />
        </>
    );
};

export default Navbar;
