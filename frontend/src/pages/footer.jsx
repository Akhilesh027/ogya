import React, { useEffect, useState } from "react";
import './Footer.css'; // Make sure to create a Footer.css file for styling
import { Link } from "react-router-dom";
import axios from "axios";

const Footer = () => {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://ogya.onrender.com/api/products");
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section quick-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">HOME</a></li>
            <li><a href="/about">ABOUT</a></li>
            <li><a href="/product">PRODUCTS</a></li>
            <li><a href="/contact">CONTACT</a></li>
          </ul>
        </div>
        <div className="footer-section products">
          <h4>Products</h4>
          <ul>
            <li><Link to={`/product/${product.id}`}>Lavender</Link></li>
            <li><Link to={`/product/9`}>Jasmine</Link></li>
            <li><Link to={`/product/10`}>Rose</Link></li>
            <li><Link to={`/product/11`}>Mogra</Link></li>
          </ul>
        </div>
        <div className="footer-section important-links">
          <h4>Important Links</h4>
          <ul>
            <li><a href="/">FAQ's</a></li>
            <li><a href="/">Get in Touch</a></li>
            <li><a href="/">Privacy Policy</a></li>
            <li><a href="/">Terms & Conditions</a></li>
            <li><a href="/">Terms of Service</a></li>
            <li><a href="/">Refund policy</a></li>
          </ul>
        </div>
        <div className="footer-section follow-us">
          <h4>Follow Us</h4>
          <p>Get Our Latest Blogs & Updates</p>
          <div className="social-icons">
            <a href="https://www.instagram.com/ogya_agarbathi/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
            <a href="https://www.facebook.com/profile.php?id=61563716431511" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
            <a href="https://www.youtube.com/@Ogya_agarbathi" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
            <a href="https://x.com/Ogya_Agarbathi" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
            <a href="https://www.linkedin.com/in/ogya-agarbathi-626505320/" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
