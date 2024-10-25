import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './combo.css';
import { Link } from 'react-router-dom';
import icon from "./Images/icon.png"
const ComboOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch combo offers from backend API
    const fetchOffers = async () => {
      try {
        const response = await axios.get('https://ogya.onrender.com/api/offer');
        setOffers(response.data);
      } catch (error) {
        console.error('Error fetching combo offers:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchOffers();
  }, []); 
  
  if (loading) {
    return <div className="loading">Loading offers...</div>; // Loading message or spinner
  }

  return (
    <>
      <div className="combooffer">
      <div className="head">
      <img className="icon" src={icon} alt="icon" />
      <h2>Comboo offers</h2>
      <img className="icon" src={icon} alt="icon" />
     </div>
        <div className="combo">
          {offers.map((offer) => (
            <div className="combo-item" key={offer.id}>
              <img src={`https://ogya.onrender.com/uploads/${offer.images}`} alt={offer.name} /> {/* Update the path based on your server configuration */}
              <div className="combo-info">
                <h2>{offer.name}</h2>
                <p>Price: ₹{offer.price}</p>
                <Link to={`/offer/${offer.id}`}> 
                  <button className="view-btn">View</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ComboOffers;
