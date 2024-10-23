// LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles.css'; // Import CSS file
import loginimg from '../Images/about.jpg';

const LoginPage = () => { 
  const [formData, setFormData] = useState({ email: '', password: '' });
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
        const response = await axios.post('https://ogya.onrender.com/login', formData);
        const { token, userId } = response.data;
        
        // Store token and userId in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        window.location.href = '/';
    } catch (error) {
        console.error('Login error:', error);
        setError('Invalid email or password');
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
            type="email"
            name="email"
            placeholder="Email"
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
