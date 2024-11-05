// src/ComboOffers.js
import React, { useState, useEffect } from 'react';
import './combo.css';
import { Link } from 'react-router-dom';
import icon from "./Images/icon.png";
import comboProducts from "./comboproducts"; // Static offers
import axios from 'axios'; // Import axios for API requests

const ComboOffers = () => {
  const [offers] = useState(comboProducts); // Use imported product data
  const [backendOffers, setBackendOffers] = useState([]); // State for backend products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch backend combo offers
  // useEffect(() => {
  //   const fetchBackendOffers = async () => {
  //     try {
  //       const response = await axios.get('https://ogya.onrender.com/api/offer'); // Adjust the API endpoint as needed
  //       setBackendOffers(response.data); // Set fetched offers
  //       setLoading(false); // Stop loading
  //     } catch (error) {
  //       console.error('Error fetching backend offers:', error);
  //       setError('Failed to load offers.'); // Set error message
  //       setLoading(false); // Stop loading
  //     }
  //   };

  //   fetchBackendOffers();
  // }, []);

  // if (loading) return <p>Loading offers...</p>; // Show loading message
  // if (error) return <p>{error}</p>; // Show error message

  return (
    <div className="combooffer">
      <div className="head">
        <img className="icon" src={icon} alt="combo offers icon" />
        <h2>Combo Offers</h2>
        <img className="icon" src={icon} alt="combo offers icon" />
      </div>
      
      {/* Static Combo Offers Section */}
      <div className="combo">
        {offers.map((offer) => (
          <div className="combo-item" key={offer.id}>
            <img 
              src={offer.images} // Ensure this is an array or adjust according to your data structure
              alt={offer.name} 
              className="offer-image" 
            />
            <div className="combo-info">
              <h2>{offer.name}</h2>
              <p>Price: ₹{offer.price}</p>
              <Link to={`/offer/${offer.id}`}>
                <button className="view-btn" aria-label={`View details of ${offer.name}`}>View</button>
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ComboOffers;
