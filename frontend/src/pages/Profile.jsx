import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './profilo.css';
import Footer from './footer';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        if (!token) {
          setError('User is not authenticated');
          setLoading(false);
          return;
        }

        const response = await axios.get('https://ogya.onrender.com/profile', {
          headers: {
            Authorization: token // Pass token in Authorization header
          }
        });

        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError(error.response?.data?.error || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    // Remove token and userId from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    
    // Redirect to the login page
    window.location.href = '/login'; // Change this to the route of your login page
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <>
      <div className="profile">
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>First Name:</strong> {userData.firstName}</p>
        <p><strong>Last Name:</strong> {userData.lastName}</p>
        <p><strong>Mobile No:</strong> {userData.mobileNo}</p>
        
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
