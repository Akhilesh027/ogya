import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = 'USER_ID'; // Replace with actual user ID from context or auth
                const response = await axios.get(`http://localhost:5000/api/orders/user/${userId}`);
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user orders:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="profile-page">
            <h2>User Profile</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <h3>Order History</h3>
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Tracking</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>₹{order.total_amount}</td>
                                    <td>{order.status}</td>
                                    <td>
                                        {order.tracking_url ? (
                                            <a href={order.tracking_url} target="_blank" rel="noopener noreferrer">Track Order</a>
                                        ) : (
                                            'No Tracking Available'
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
