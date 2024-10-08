import React from "react";
import "./About.css"; // Import the CSS file for styling
import aboutImg from './Images/rose.png'
import img from './Images/mogra.png'
const About = () => {
  return (
    <>
    <div className="about-container">
      <div className="about-image">
        <img src={aboutImg} alt="About Us" />
      </div>
      <div className="about-text">
        <h1>About Us</h1>
        <p>
          Founded in 2024, Ogya Agarbathi emerged from a deep passion for
          bringing nature's purest fragrances into your daily life. Our journey
          began with a simple yet profound vision: to create high-quality, 100%
          natural incense sticks that promote wellness, tranquility, and a
          deeper connection with the natural world.
        </p>
        <p>
          At Ogya Agarbathi, we believe that the essence of nature can
          profoundly enhance our well-being. That's why we meticulously source
          the finest botanicals and natural ingredients, ensuring that each
          incense stick is free from harmful chemicals and synthetic additives.
          Our commitment to sustainability and purity is at the heart of
          everything we do, from the selection of raw materials to our
          eco-friendly packaging.
        </p>
        <div className="social-media">
          <a
            href="https://www.facebook.com/profile.php?id=61563716431511"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://x.com/Ogya_Agarbathi"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://www.instagram.com/ogya_agarbathi/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/ogya-agarbathi-626505320/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a
            href="https://www.youtube.com/@Ogya_agarbathi"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </div>
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
        <img src={img} alt="Unique Selling Proposition" />
      </div>
    </div>
    <div className="content-section">
      <div className="image-content">
        <img src={aboutImg} alt="Our Values" />
      </div>
      <div className="text-content">
        <h2>Enhance Your Well-Being</h2>
        <p>
          Enhance your well-being and create a serene ambiance in your home with Ogya Agarbathi. Choose from our exquisite range of natural incense sticks and let the pure, soothing aromas uplift your spirit and transform your space into a sanctuary of peace and tranquility.
        </p>
      </div>
    </div>
  
  </div>
  </>
  );
};

export default About;
