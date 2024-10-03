import React from "react";
import ProductsPage from "./ProductsPage";
import ReviewPage from "./ReviewPage";
import Footer from "./footer";
import video from "./Images/video.mp4";
import "./Home.css"; // Make sure to include this for styling
import { Link } from "react-router-dom";
import image from "./Images/about.jpg";
import ComboOffers from "./ComboOffers";
import chat from './Images/chat.svg'
const HomePage = () => {
  return (
    <div className="home-page">
      <div className="video-section">
        {/* Added playsInline to ensure the video plays inline on iOS */}
        <video src={video} autoPlay muted loop playsInline></video>
      </div>

      <div className="offers">
  <div className="scrolling-container">
    <div className="scrolling-text">
      Navaratri Exclusive - Shop Now & Save Big This Festive Season! &nbsp; &nbsp; Navaratri Exclusive - Shop Now & Save Big This Festive Season! &nbsp; &nbsp; Navaratri Exclusive - Shop Now & Save Big This Festive Season!
    </div>
  </div>
</div>


      <div className="offerposter">
        <ComboOffers />
      </div>

      <div className="products-section">
        <ProductsPage />
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
      </div>

      <div className="review-section">
        <ReviewPage />
      </div>

      {/* WhatsApp Chat Section */}
      <div className="chatwithus">
        <a
          href="https://wa.me/yourphonenumber"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-link"
        >
          <img src={chat} alt="" />
        </a>
      </div>

    </div>
  );
};

export default HomePage;
