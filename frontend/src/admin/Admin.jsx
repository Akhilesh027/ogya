import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Fetch total orders
    axios.get('http://localhost:5000/api/totalOrders')
      .then(response => {
        setTotalOrders(response.data.totalOrders);
      })
      .catch(error => {
        console.error('Error fetching total orders:', error);
      });

    // Fetch total amount generated
    axios.get('http://localhost:5000/api/totalAmount')
      .then(response => {
        setTotalAmount(response.data.totalAmount);
      })
      .catch(error => {
        console.error('Error fetching total amount:', error);
      });
  }, []);

  return (
    <div className="admin-container">
    
      <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Total Amount Generated</h3>
            <p>₹{totalAmount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
