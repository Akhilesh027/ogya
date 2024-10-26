import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars, FaUser, FaSearch, FaTimes } from "react-icons/fa"; 
import "./Navbar.css";
import CartDrawer from "./CartPage";
import { CartContext } from './CartContext';
import logo from "../pages/Images/logo1.png";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const { cartItems } = useContext(CartContext);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const suggestions = [
    { name: "Mogra", link: "/product/24" },
    { name: "Lavender", link: "/product/21" },
    { name: "Jasmine", link: "/product/23" },
    { name: "Rose", link: "/product/22" },
  ];

  const totalCartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchSuggestions(isSearchOpen ? [] : suggestions);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav id="navbar" className="navbar">
        <div className="hamburger">
          <FaBars size={25} onClick={toggleMenu} />
        </div>
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        
        <div className="mcart">
          <Link onClick={toggleCart} id="cart">
            <div className="cartdiv">
            <FaShoppingCart size={20} />
            {totalCartQuantity > 0 && (
              <span className="cart-count">{totalCartQuantity}</span>
            )}
            </div>
          </Link>
          <Link onClick={toggleSearch} className="link">
            <FaSearch color="white" size={20} />
          </Link>
        
            <Link to={`/profile`}>
              <FaUser color="white" size={20} />
            </Link>
          
        </div>

        <div className={`links ${isMenuOpen ? "active" : ""}`}>
          <Link to="/" className="link" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/about" className="link" onClick={closeMenu}>
            About
          </Link>
          <Link to="/product" className="link" onClick={closeMenu}>
            Product
          </Link>
          <Link to="/contact" className="link" onClick={closeMenu}>
            Contact
          </Link>
        </div>

        <div>
          <ul className={`navLinks ${isMenuOpen ? "active" : ""}`}>
            <li>
              <Link onClick={toggleCart} className="link" id="cart">
                <div className="cartdiv">
                <FaShoppingCart size={20} />
                {totalCartQuantity > 0 && (
                  <span className="cart-count">{totalCartQuantity}</span>
                )}
                </div>
              </Link>
              <Link onClick={toggleSearch} className="link" id="search">
                <FaSearch size={20} />
              </Link>
              {isLoggedIn ? (
                <>
                  <Link to={`/profile`}>
                    <FaUser color="white" size={20} />
                  </Link>
                  <button
                    id="logout"
                    className="loginbtn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link className="link" id="login" to="/login">
                  <button className="loginbtn">Login</button>
                </Link>
              )}
            </li>
          </ul>
          {isSearchOpen && (
            <>
              <div className="search-bar">
                <input type="text" placeholder="Search..." />
                <FaTimes
                  className="close-icon"
                  size={20}
                  onClick={toggleSearch}
                />
              </div>
              <div className="search-suggestions">
                {searchSuggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-item">
                    <Link className="sLink" to={suggestion.link}>
                      {suggestion.name}
                    </Link>
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
