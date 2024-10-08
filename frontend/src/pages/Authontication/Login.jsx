// LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles.css'; // Import CSS file
import loginimg from '../Images/about.jpg';

const LoginPage = () => { 
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the backend
      const response = await axios.post('https://ogya.onrender.com/login', formData);
      
      // Log the response to see if the userId is present
      console.log('Login response:', response.data);
  
      const { token, role, userId } = response.data; // Extract token, role, and userId from the response
  
      // Check if userId is undefined
      if (!userId) {
        console.error('User ID is undefined!');
        return;
      }
  
      // Store the token and userId in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId); // Store userId in local storage
  
      console.log('Logged in User ID:', userId); // Console log the user ID after login
  
      // Navigate based on role
      if (role === 'admin') {
        navigate('/admin'); // Redirect to admin dashboard
      } else {
        navigate('/'); // Redirect to user home
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  


  return (
    <div className="login">
      <div>
        <img src={loginimg} alt="login" />
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          {error && <p className="error-message">{error}</p>} {/* Display error message */}
          <div className="link-container">
            <p>Don't have an account? <a href="/register">Register here</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
