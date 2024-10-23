import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './ConfirmationPage.css';
import Footer from './footer';

const ConfirmationPage = () => {
    const location = useLocation();
    const { orderDetails } = location.state || {};
    
    const [animationStarted, setAnimationStarted] = useState(false);
    
    useEffect(() => {
        // Start the animation when the component is mounted
        setAnimationStarted(true);
    }, []);

    if (!orderDetails) {
        return <div>No order details available</div>;
    }

    return (
        <>
        <div className={`confirmation-page ${animationStarted ? 'fade-in' : ''}`}>
            {/* Animated "Order Confirmed" */}
            <div className={`confirmation-animation ${animationStarted ? 'slide-in' : ''}`}>
                <h1>Order Confirmed!</h1>
            </div>
            
            {/* Order Details Section */}
            <div className={`order-details ${animationStarted ? 'slide-in' : ''}`}>
                <p className="order-id">Order ID: {orderDetails.id}</p>
                <p>Payment Method: {orderDetails.paymentMethod}</p>
                <p>Amount: ₹{orderDetails.amount}</p>
                <p className="status">Status: {orderDetails.paymentStatus}</p>
            </div>
            
            {/* Order Summary Section */}
           
            {/* Back to Home Button */}
            <div className="back-to-home">
                <Link to="/" className="back-home-btn">Back to Home</Link>
            </div>
            
        </div>
        
        <Footer/></>
    );
};

export default ConfirmationPage;
