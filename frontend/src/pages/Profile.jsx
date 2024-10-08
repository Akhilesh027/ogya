import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { userId } = useParams(); // Use useParams here to get the userId

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token'); // Get the token from local storage
                const userId = localStorage.getItem('userId')
                // Check if userId is available
                if (!userId) {
                    throw new Error('User ID not found');
                }

                // Fetch user details using the user ID
                const response = await axios.get(`http://localhost:5000/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user data. Please try again.');
                // Optionally redirect to login if unauthorized
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate, userId]); // Add userId as a dependency

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token
        localStorage.removeItem('userId'); // Clear the user ID
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <div className="profile-page">
            <h2>User Profile</h2>
            {userId}
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error-message">{error}</p> // Display error message
            ) : (
                user && (
                    <div className="user-details">
                        <h3>{user.username}</h3>
                        <p>Email: {user.email}</p>
                        <p>Name: {user.firstName} {user.lastName}</p>
                        <p>Phone Number: {user.mobileNo}</p>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                )
            )}
        </div>
    );
};

export default ProfilePage;
