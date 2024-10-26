import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './profilo.css';
import Footer from './footer';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      
      // Check if user is not authenticated
      if (!token) {
        setError('Please log in to view your profile.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://ogya.onrender.com/profile', {
          headers: {
            Authorization: token
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
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login'); // Redirect to login page
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return (
      <div className="profile-error">
        <p role="alert">{error}</p>
        {!userData && (
          <button onClick={() => navigate('/login')} className="login-button">
            Login
          </button>
        )}
      </div>
    );
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
