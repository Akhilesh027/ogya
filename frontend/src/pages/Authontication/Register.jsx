// RegistrationPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles.css'; // Import CSS file
import regimg from '../Images/about.jpg';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNo: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  
    try {
      await axios.post('https://ogya.onrender.com/register', formData);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);  
    }
  };

  return (
    <div className="login">
      <div>
        <img src={regimg} alt="reg" />
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
          <input type="text" name="mobileNo" placeholder="Mobile Number" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          
          <div className="link-container">
            <p>Already have an account? <a href="/login">Login here</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
