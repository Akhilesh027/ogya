import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './ContactPage.css';

const ContactPage = () => {
  
  const [formData, setFormData] = useState({ name: '', email: '', phonenumber: '' });
  const [statusMessage, setStatusMessage] = useState('');



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://ogya.onrender.com/api/contact', formData);
      setStatusMessage('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatusMessage('Failed to send message.');
      console.error(error);
    }
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title" >Contact Us</h1>
      <div className="contact-info">
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

            <label htmlFor="number">number</label>
            <input type="phonenumber" name="phonenumber" id="phonenumber" value={formData.phonenumber} onChange={handleChange} required />
            <button type="submit">Send Message</button>
          </form>
          {statusMessage && <p>{statusMessage}</p>}
        </div>
        <div className="contact-details">
          <h2>Contact Information</h2>
          <p><i className="fas fa-map-marker-alt"></i> 123 Street, City, Country</p>
          <p><i className="fas fa-phone-alt"></i> +123 456 7890</p>
          <p><i className="fas fa-envelope"></i> info@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
