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
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isPayPalLoaded, setIsPayPalLoaded] = useState(false);
    const [loading, setLoading] = useState(false); // New loading state

    const location = useLocation();
    const { cartItems, totalAmount } = location.state || { cartItems: [], totalAmount: 0 };
    const navigate = useNavigate();

    useEffect(() => {
        if (paymentMethod === 'paypal') {
            loadPayPalScript();
        }
    }, [paymentMethod]);

    const loadPayPalScript = () => {
        if (window.paypal) {
            setIsPayPalLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = "https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID"; // Replace with your PayPal client ID
        script.onload = () => setIsPayPalLoaded(true);
        document.body.appendChild(script);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handlePaymentSuccess = (paymentDetails) => {
        // Handle payment success and submit order details to the backend
        submitOrder(paymentDetails);
    };

    const handlePayment = (event) => {
        event.preventDefault();

        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        setLoading(true); // Show loading spinner

        if (paymentMethod === 'razorpay') {
            handleRazorpayPayment();
        } else if (paymentMethod === 'paypal') {
            if (!isPayPalLoaded) {
                alert('PayPal is not loaded yet. Please try again.');
                setLoading(false); // Hide loading spinner
                return;
            }
            handlePayPalPayment();
        } else if (paymentMethod === 'cod') {
            console.log('Cash on Delivery selected');
            handlePaymentSuccess({
                orderId: Date.now(),
                paymentMethod: 'Cash on Delivery',
                paymentStatus: 'Pending',
                transactionId: null,
                amount: totalAmount
            });
        }
    };

    const handleRazorpayPayment = () => {
        const options = {
            key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay key ID
            amount: totalAmount * 100,
            currency: "INR",
            name: "Your Company",
            description: "Test Transaction",
            handler: function (response) {
                console.log("Razorpay Payment Success:", response);
                handlePaymentSuccess({
                    orderId: response.razorpay_order_id,
                    paymentMethod: 'Razorpay',
                    paymentStatus: 'Completed',
                    transactionId: response.razorpay_payment_id,
                    amount: totalAmount
                });
            },
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone,
            },
            theme: {
                color: "#3399cc"
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const handlePayPalPayment = () => {
        window.paypal.Buttons({
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            currency_code: "USD",
                            value: (totalAmount / 74).toFixed(2) // Convert INR to USD, approximate conversion rate
                        }
                    }]
                });
            },
            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    console.log("PayPal Payment Success:", details);
                    handlePaymentSuccess({
                        orderId: details.id,
                        paymentMethod: 'PayPal',
                        paymentStatus: 'Completed',
                        transactionId: details.id,
                        amount: (totalAmount / 74).toFixed(2) // Convert INR to USD
                    });
                });
            }
        }).render('#paypal-button-container');
    };

    const submitOrder = async (paymentDetails) => {
        try {
            const orderData = {
                ...formData,
                paymentMethod: paymentDetails.paymentMethod,
                transactionId: paymentDetails.transactionId,
                paymentStatus: paymentDetails.paymentStatus,
                amount: paymentDetails.amount
            };

            const response = await axios.post('https://ogya.onrender.com/api/billing', orderData);

            if (response.status === 201) {
                setLoading(false); // Hide loading spinner
                navigate('/confirmation', { state: { orderDetails: response.data } }); // Redirect to confirmation page
            }
        } catch (error) {
            console.error('Error recording order details:', error);
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
                                <div>Free shipping</div>
                            </div>
                            <div className="order-total">
                                <div>Total</div>
                                <div>₹{totalAmount}</div>
                            </div>
                        </div>
                    )}

                    <div className="payment-page">
                        <h2>Payment Options</h2>
                        <div className="payment-method">
                            <label>
                                <input
                                    type="radio"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={handlePaymentMethodChange}
                                />
                                                                Card Payment

                                <img src={cardimg} alt="Card Payment" />
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    value="razorpay"
                                    checked={paymentMethod === 'razorpay'}
                                    onChange={handlePaymentMethodChange}
                                />
                                  Razorpay Payment
                                <img src={razorpayimg} alt="Razorpay Payment" />
                            </label>

                            

                            <label>
                                <input
                                    type="radio"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={handlePaymentMethodChange}
                                />
                                 Cash on Delivery
                                <img src={cod} alt="COD" />
                            </label>
                            
                        </div>
                        {paymentMethod === "card" && (
                            <div className="card-details">
                                <h2>Credit/Debit Card Details</h2>
                                <label>
                                    Card Number:
                                    <input type="text" name="cardNumber" required />
                                </label>
                                <label>
                                    Expiry Date:
                                    <input type="text" name="expiryDate" required />
                                </label>
                                <label>
                                    CVV:
                                    <input type="text" name="cvv" required />
                                </label>
                            </div>
                        )}
                        <button type="submit" className="submit-btn">Place Order</button>

                    </div>
                </div>
            </div>


            <div id="paypal-button-container"></div>
        </form>
    );
};

export default Buy;
