import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './buy.css';
import razorpayimg from '../pages/Images/pg.jpg';
import cod from '../pages/Images/cod.webp';

const Buy = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        country: "",
        streetAddress: "",
        townCity: "",
        state: "",
        pinCode: "",
        phone: "",
        email: "",
        userId: ""
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    
    const location = useLocation();
    const { cartItems, totalAmount, userId } = location.state || { cartItems: [], totalAmount: 0, userId: null };
    const navigate = useNavigate();

    useEffect(() => {
        setDeliveryCharge(totalAmount < 500 ? 50 : 0);
        loadRazorpayScript();
    }, [totalAmount]);

    const loadRazorpayScript = () => {
        const script = document.createElement('script');
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => console.log("Razorpay script loaded");
        document.body.appendChild(script);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handlePayment = async (event) => {
        event.preventDefault();
    
        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }
    
        setLoading(true);
    
        if (paymentMethod === 'razorpay') {
            await handleRazorpayPayment();
        } else if (paymentMethod === 'cod') {
            const paymentDetails = {
                orderId: Date.now(),
                paymentMethod: 'Cash on Delivery',
                paymentStatus: 'Confirmed',
                transactionId: null,
                amount: totalAmount + deliveryCharge
            };
            await submitOrder(paymentDetails);
        }
    };

    const handleRazorpayPayment = async () => {
        try {
            const { data: orderData } = await axios.post('https://ogya.onrender.com/api/create-order', {
                ...formData,
                userId: userId,
                amount: (totalAmount + deliveryCharge) * 100
            });
    
            const options = {
                key: 'rzp_live_qO97ytpJFY75xi',
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Your Company Name',
                description: 'Payment for order',
                order_id: orderData.orderId,
                handler: async (response) => {
                    try {
                        const verificationResponse = await axios.post('https://ogya.onrender.com/api/payment/verify', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verificationResponse.status === 200) {
                            const paymentDetails = {
                                orderId: orderData.orderId,
                                paymentMethod: 'Razorpay',
                                paymentStatus: 'Completed',
                                transactionId: response.razorpay_payment_id,
                                amount: orderData.amount
                            };
                            await submitOrder(paymentDetails);
                            alert('Payment successful!');
                        } else {
                            alert('Payment verification failed.');
                        }
                    } catch (error) {
                        console.error('Error during payment verification:', error);
                        alert('Payment verification failed. Please try again.');
                    }
                },
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.phone,
                },
            };
    
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Error during payment process:', error);
            alert('Payment failed. Please try again.');
            setLoading(false);
        }
    };

    const submitOrder = async (paymentDetails) => {
        try {
            const orderData = {
                ...formData,
                userId: userId,
                paymentMethod: paymentDetails.paymentMethod,
                transactionId: paymentDetails.transactionId,
                paymentStatus: paymentDetails.paymentStatus,
                amount: paymentDetails.amount
            };
    
            const response = await axios.post('https://ogya.onrender.com/api/order', orderData);
    
            if (response.status === 201) {
                setLoading(false);
                navigate('/confirmation', { state: { orderDetails: response.data } });
            }
        } catch (error) {
            console.error('Error recording order details:', error);
            alert('Failed to record order details. Please try again.');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handlePayment} className="billing-form">
            {loading && <div className="loading-spinner">Loading...</div>}
            <div className="billing-data">
                <div className="billing-details">
                    <h2>Billing details</h2>
                    <label>First name *</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <label>Last name *</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                    <label>Country / Region *</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                    />
                    <label>Street address *</label>
                    <input
                        type="text"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        required
                    />
                    <label>Town / City *</label>
                    <input
                        type="text"
                        name="townCity"
                        value={formData.townCity}
                        onChange={handleChange}
                        required
                    />
                    <label>State *</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                    />
                    <label>PIN Code *</label>
                    <input
                        type="text"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleChange}
                        required
                    />
                    <label>Phone *</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    <label>Email address *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="order-details">
                    <h2>Your order</h2>
                    {cartItems.length === 0 ? (
                        <p>No items in the cart.</p>
                    ) : (
                        <div className="order-summary">
                            {cartItems.map((item) => (
                                <div key={item.id} className="order-item">
                                    <div>
                                        {item.name} × {item.quantity}
                                    </div>
                                    <div>₹{item.price * item.quantity}</div>
                                </div>
                            ))}
                            <div className="order-shipping">
                                <div>Shipping</div>
                                <div>{deliveryCharge > 0 ? '₹50' : 'Free shipping'}</div>
                            </div>
                            <div className="order-total">
                                <div>Total</div>
                                <div>₹{totalAmount + deliveryCharge}</div>
                            </div>
                        </div>
                    )}

                    <div className="payment-page">
                        <h2>Payment Options</h2>
                        <div className="payment-method">
    <label className="payment-option">
        <input
            type="radio"
            value="razorpay"
            checked={paymentMethod === 'razorpay'}
            onChange={handlePaymentMethodChange}
        />
        <span className="payment-text">Razorpay</span>
        <img src={razorpayimg} alt="Razorpay" />
    </label>
    <label className="payment-option">
        <input
            type="radio"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={handlePaymentMethodChange}
        />
        <span className="payment-text">Cash on Delivery</span>
        <img src={cod} alt="Cash on Delivery" />
    </label>
</div>

                        <button type="submit" disabled={loading}>
                            {loading ? 'Processing...' : 'Place order'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Buy;
