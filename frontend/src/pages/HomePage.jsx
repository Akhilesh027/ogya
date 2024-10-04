import React, { useState } from "react";
import ProductsPage from "./ProductsPage";
import ReviewPage from "./ReviewPage";
import video from "./Images/video.mp4";
import "./Home.css"; // Make sure to include this for styling
import { Link } from "react-router-dom";
import image from "./Images/about.jpg";
import ComboOffers from "./ComboOffers";
import chat from './Images/chat.svg';
import sale from './Images/Sale.png';

const HomePage = () => {
  const [showCombo, setShowCombo] = useState(false); // State to control combo offer visibility

  const handleShowCombo = () => {
    setShowCombo(!showCombo); // Toggle the state on button click
  };

  return (
    <div className="home-page">
      <header className="video-section">
        <video src={video} autoPlay muted loop playsInline>
          Your browser does not support the video tag.
        </video>
      </header>

      <section className="offers">
        <div className="scrolling-container">
          <div className="scrolling-text">
            Special Offer Navaratri Exclusive - Shop Now & Save Big This Festive Season!
            &nbsp; &nbsp; Special Offer Navaratri Exclusive - Shop Now & Save Big This Festive Season!
            &nbsp; &nbsp; Special Offer Navaratri Exclusive - Shop Now & Save Big This Festive Season!
          </div>
        </div>
      </section>

      <section className="offerposter">
        <img src={sale} className='poster' alt="Special Sale Promotion" />
        <ComboOffers/>
      </section>

      <section className="products-section">
        <ProductsPage />
      </section>

      <section className="why-choose-us">
        <h1>Why Choose Ogya Agarbathi?</h1>
        <p>Your trusted source for natural and authentic incense sticks.</p>

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
      </section>

      <section className="review-section">
        <ReviewPage />
      </section>

      {/* WhatsApp Chat Section */}
      <div className="chatwithus">
        <a
          href="https://wa.me/+919550379505" // Update with your actual phone number
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-link"
        >
          <img src={chat} alt="Chat with us on WhatsApp" />
        </a>
      </div>

    </div>
  );
};

export default HomePage;
