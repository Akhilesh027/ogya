import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming token contains user information
                const response = await axios.get(`https://ogya.onrender.com/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <div className="profile-page">
            <h2>User Profile</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                user && (
                    <div className="user-details">
                        <h3>{user.name}</h3>
                        <p>Email: {user.email}</p>
                        <p>name: {user.username}</p>
                        <p>phone number: {user.mobileNo}</p>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                )
            )}
        </div>
    );
};

export default ProfilePage;
