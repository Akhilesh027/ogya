import React from "react";
import ProductsPage from "./ProductsPage";
import ReviewPage from "./ReviewPage";
import Footer from "./footer";
import video from './Images/Ogyaback.mp4';
import './Home.css'; // Make sure to include this for styling
import { Link } from "react-router-dom";
import image from './Images/about.jpg'
const HomePage = () => {
  return (
    <div className="home-page">
      <div className="video-section">
        <video src={video} autoPlay muted loop></video>
      </div>
      <div className="home-text">
        {/* <h1>Welcome To Ogya Agarbathi</h1> */}
        {/* <p>
          Discover Ogya Agarbathi, where nature and tranquility unite in every incense stick. 
          Crafted with the finest natural ingredients, our organic incense brings peace and 
          harmony to your space. Perfect for meditation, yoga, or simply refreshing your home, 
          each stick offers a clean, soothing burn free from harmful chemicals. 
          Elevate your senses with the pure essence of Ogya Agarbathi and create a serene sanctuary 
          that uplifts the spirit. Experience the natural, enriching aroma today.
        </p> */}
      </div>
      <div className="offers">
    <div className="scrolling-container">
        <div className="scrolling-text">
            Special Offers! Get <span className="highlight">20% off</span> on your first purchase. Free shipping on orders over <span className="highlight">₹500</span>. Limited time only! &nbsp; &nbsp;
            Special Offers! Get <span className="highlight">20% off</span> on your first purchase. Free shipping on orders over <span className="highlight">₹500</span>. Limited time only! &nbsp; &nbsp;
            Special Offers! Get <span className="highlight">20% off</span> on your first purchase. Free shipping on orders over <span className="highlight">₹500</span>. Limited time only!
        </div>
    </div>
</div>
<div className="offerposter">
  <div>
    <h1>offer 2+1</h1>
    <img src={image} alt="" />
  </div>
</div>

      <div className="products-section">
        <ProductsPage />
      </div>
      <div>
        
      </div>
      <div className="why-choose-us">
  <div className="hero-section">
    <h1>Why Choose Ogya Agarbathi?</h1>
    <p>Your trusted source for natural and authentic incense sticks.</p>
  </div>
  <div className="content-section">
    <div className="text-content">
      <h2>Unique Selling Proposition (USP)</h2>
      <p>
        At Ogya Agarbathi, we are committed to providing you with a superior aromatic experience through our carefully crafted incense sticks.
      </p>
      <ul>
        <li><strong>100% Natural Ingredients:</strong> Our incense sticks are made from the finest natural ingredients, ensuring a pure and authentic aromatic experience.</li>
        <li><strong>Sustainable Sourcing:</strong> We are committed to sustainability, sourcing our botanicals from farms that respect and preserve the environment.</li>
        <li><strong>Chemical-Free:</strong> Enjoy a clean and soothing burn, free from harmful chemicals and synthetic additives.</li>
        <li><strong>Handcrafted Quality:</strong> Each incense stick is carefully crafted to deliver the best in fragrance and quality.</li>
      </ul>
    </div>
    <div className="image-content">
      <img src={image} alt="Unique Selling Proposition" />
    </div>
  </div>
  <div className="content-section">
    <div className="image-content">
      <img src={image} alt="Our Values" />
    </div>
    <div className="text-content">
      <h2>Enhance Your Well-Being</h2>
      <p>
        Enhance your well-being and create a serene ambiance in your home with Ogya Agarbathi. Choose from our exquisite range of natural incense sticks and let the pure, soothing aromas uplift your spirit and transform your space into a sanctuary of peace and tranquility.
      </p>
    </div>
  </div>
  <div className="cta-section">
    <button className="cta-button">Learn More</button>
  </div>
</div>

      <div className="review-section">
        <ReviewPage />
      </div>
      <div className="chatwithus">
      <a href="https://wa.me/yourphonenumber" target="_blank" rel="noopener noreferrer">
        <i id="icon" className="fab fa-whatsapp"></i>
      </a>
      </div>
    </div>
  );
};

export default HomePage;
