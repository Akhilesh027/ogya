// ConfirmationPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import './ConfirmationPage.css';

const ConfirmationPage = () => {
    const location = useLocation();
    const { orderDetails } = location.state || {};

    if (!orderDetails) {
        return <div>No order details available</div>;
    }

    return (
        <div className="confirmation-page">
            <h1>Order Confirmation</h1>
            <div className="order-details">
                <p className="order-id">Order ID: {orderDetails.orderId}</p>
                <p>Payment Method: {orderDetails.paymentMethod}</p>
                <p>Amount: ₹{orderDetails.amount}</p>
                <p className="status">Status: {orderDetails.paymentStatus}</p>
            </div>
            <div className="order-summary">
                <h2>Order Summary</h2>
                {/* You can add more details about the order summary here */}
            </div>
            <div className="back-to-home">
                <a href="/">Back to Home</a>
            </div>
        </div>
    );
};

export default ConfirmationPage;
