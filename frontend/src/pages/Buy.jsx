import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './buy.css';
import cardimg from '../pages/Images/card.png';
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
        // Apply delivery charge if totalAmount is less than 500
        setDeliveryCharge(totalAmount < 500 ? 50 : 0);
        // Load Razorpay script
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

    const generateRandomOrderId = () => {
        return 'ORDER_' + Math.floor(Math.random() * 1000000000);
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
                orderId: generateRandomOrderId(), // Unique order ID for COD
                paymentMethod: 'Cash on Delivery',
                paymentStatus: 'Confirmed', // Set to confirmed for COD
                transactionId: null, // No transaction ID for COD
                amount: totalAmount + deliveryCharge // Correct calculation
            };
            await submitOrder(paymentDetails); // Submit order with payment details
        }
    };

    const handleRazorpayPayment = async () => {
        try {
            // Create an order on the backend
            const { data: orderData } = await axios.post('https://ogya.onrender.com/api/create-order', {
                ...formData,
                userId: userId, // Include userId in the order creation
                amount: (totalAmount + deliveryCharge) * 100 // Convert to paise for Razorpay
            });

            // Initiate Razorpay payment
            const options = {
                key: 'rzp_live_qO97ytpJFY75xi', // Your Razorpay key ID
                amount: orderData.amount, // Amount in paise
                currency: orderData.currency,
                name: 'Your Company Name', // Your company name
                description: 'Payment for order',
                order_id: orderData.orderId, // This is the order ID you got from the backend
                handler: async (response) => {
                    try {
                        // Payment successful
                        const verificationResponse = await axios.post('https://ogya.onrender.com/api/payment/verify', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verificationResponse.status === 200) {
                            // After successful payment, submit the order
                            const paymentDetails = {
                                orderId: orderData.orderId, // Use Razorpay order ID
                                paymentMethod: 'Razorpay',
                                paymentStatus: 'Completed', // Set status as completed
                                transactionId: response.razorpay_payment_id, // Store payment ID
                                amount: orderData.amount / 100, // Convert back to original amount
                            };

                            // Submit order to API
                            await submitOrder(paymentDetails); // Submit order with payment details
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
            setLoading(false); // Hide loading spinner on error
        }
    };

    const submitOrder = async (paymentDetails) => {
        try {
            const orderData = {
                ...formData,
                userId: userId || formData.userId, // Include userId in the order submission, fallback to formData.userId
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
            alert('Failed to record order details. Please try again.'); // Inform the user
            setLoading(false); // Hide loading spinner on error
        }
    };

    return (
        <form onSubmit={handlePayment} className="billing-form">
            {loading && <div className="loading-spinner">Loading...</div>} {/* Loading Spinner */}

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
                                <div>{deliveryCharge > 0 ? '₹' + deliveryCharge : 'Free'}</div>
                            </div>
                            <div className="order-total">
                                <div>Total</div>
                                <div>₹{totalAmount + deliveryCharge}</div>
                            </div>

                        </div>
                    )}
                    <div className="payment-method">
                    <h2>Payment Method</h2>
                    <div className="payment-option">
                        <input
                            type="radio"
                            id="cod"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={handlePaymentMethodChange}
                        />
                        <label htmlFor="cod">
                            <img src={cod} alt="COD" /> Cash on Delivery
                        </label>
                    </div>

                    <div className="payment-option">
                        <input
                            type="radio"
                            id="razorpay"
                            name="paymentMethod"
                            value="razorpay"
                            checked={paymentMethod === 'razorpay'}
                            onChange={handlePaymentMethodChange}
                        />
                        <label htmlFor="razorpay">
                            <img src={razorpayimg} alt="Razorpay" /> Pay with Razorpay
                        </label>
                    </div>

                    <button type="submit" className="place-order-button" disabled={loading}>
                        {loading ? 'Placing order...' : 'Place Order'}
                    </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Buy;
