// src/pages/ViewBillings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewBillings.css'; // Import your CSS file

const ViewBillings = () => {
    const [orders, setOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState({});

    useEffect(() => {
        const fetchBillings = async () => {
            try {
                const response = await axios.get('https://ogya.onrender.com/api/billing');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching billings', error);
            }
        };

        fetchBillings();
    }, []);

    const handleStatusChange = (orderId, status) => {
        setSelectedStatus((prevStatus) => ({
            ...prevStatus,
            [orderId]: status,
        }));
    };

    const updateOrderStatus = async (orderId) => {
        try {
            const status = selectedStatus[orderId];
            if (status) {
                await axios.put(`https://ogya.onrender.com/orders/${orderId}/status`, { status });
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId ? { ...order, paymentStatus: status } : order
                    )
                );
                alert(`Order ${orderId} status updated to ${status}`);
            }
        } catch (error) {
            console.error('Error updating order status', error);
        }
    };

    return (
        <>
            <div className="dashboard-section">
                <h2>Orders</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Country</th>
                            <th>Street Address</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Pin Code</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Payment Method</th>
                            <th>Order Status</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.firstName}</td>
                                <td>{order.country}</td>
                                <td>{order.streetAddress}</td>
                                <td>{order.townCity}</td>
                                <td>{order.state}</td>
                                <td>{order.pinCode}</td>
                                <td>{order.phone}</td>
                                <td>{order.email}</td>
                                <td>{order.paymentMethod}</td>
                                <td>
                                    <select
                                        value={selectedStatus[order.id] || order.paymentStatus}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                                <td>₹{order.amount}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => updateOrderStatus(order.id)}>Update Status</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ViewBillings;
