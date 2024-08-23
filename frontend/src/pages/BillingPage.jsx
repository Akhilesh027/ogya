import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './BillingPage.css';

const BillingPage = () => {
    const location = useLocation();
    const { totalAmount } = location.state || {}; // Retrieve state from navigation
    const [paymentMethod, setPaymentMethod] = useState('');
    const [billingInfo, setBillingInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: ''
    });
    const [isPayPalLoaded, setIsPayPalLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    useEffect(() => {
        if (paymentMethod === 'paypal') {
            loadPayPalScript();
        }
    }, [paymentMethod]);

    const handlePayment = async (event) => {
        event.preventDefault();

        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        setIsLoading(true); // Set loading state to true

        try {
            if (paymentMethod === 'razorpay') {
                handleRazorpayPayment();
            } else if (paymentMethod === 'paypal') {
                if (!isPayPalLoaded) {
                    alert('PayPal is not loaded yet. Please try again.');
                    setIsLoading(false); // Set loading state to false
                    return;
                }
                handlePayPalPayment();
            } else if (paymentMethod === 'cod') {
                console.log('Cash on Delivery selected');
                await handlePaymentSuccess({
                    orderId: Date.now(),
                    paymentMethod: 'Cash on Delivery',
                    paymentStatus: 'Pending',
                    transactionId: null,
                    amount: totalAmount
                });
            }
        } catch (error) {
            console.error('Error during payment:', error);
            setIsLoading(false); // Set loading state to false on error
        }
    };

    const handleRazorpayPayment = () => {
        const options = {
            key: "YOUR_RAZORPAY_KEY_ID",
            amount: totalAmount * 100,
            currency: "INR",
            name: "Your Company",
            description: "Test Transaction",
            handler: async function (response) {
                console.log("Razorpay Payment Success:", response);
                await handlePaymentSuccess({
                    orderId: response.razorpay_order_id,
                    paymentMethod: 'Razorpay',
                    paymentStatus: 'Completed',
                    transactionId: response.razorpay_payment_id,
                    amount: totalAmount
                });
                setIsLoading(false); // Set loading state to false after payment
            },
            prefill: {
                name: billingInfo.name,
                email: billingInfo.email,
                contact: billingInfo.phone,
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
            onApprove: async function (data, actions) {
                const details = await actions.order.capture();
                console.log("PayPal Payment Success:", details);
                await handlePaymentSuccess({
                    orderId: details.id,
                    paymentMethod: 'PayPal',
                    paymentStatus: 'Completed',
                    transactionId: details.id,
                    amount: (totalAmount / 74).toFixed(2) // Convert INR to USD
                });
                setIsLoading(false); // Set loading state to false after payment
            }
        }).render('#paypal-button-container');
    };

    const handlePaymentSuccess = async (paymentDetails) => {
        try {
            const orderData = {
                ...billingInfo,
                paymentMethod: paymentDetails.paymentMethod,
                transactionId: paymentDetails.transactionId,
                paymentStatus: paymentDetails.paymentStatus,
                amount: paymentDetails.amount
            };
    
            const response = await axios.post('https://ogya.onrender.com/api/order', orderData);
    
            if (response.status === 201) {
                alert("Order successfully completed");
                console.log('Order and payment details recorded successfully:', response.data);
            }
        } catch (error) {
            console.error('Error recording order details:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBillingInfo({ ...billingInfo, [name]: value });
    };

    return (
        <div className="billing-page">
            <h2>Billing Information</h2>
            {isLoading && <div className="loading-overlay">Processing payment...</div>}
            <form onSubmit={handlePayment} disabled={isLoading}>
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value={billingInfo.name} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={billingInfo.email} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" value={billingInfo.phone} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <input type="text" name="address" value={billingInfo.address} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div className="form-group">
                    <label>City</label>
                    <input type="text" name="city" value={billingInfo.city} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div className="form-group">
                    <label>State</label>
                    <input type="text" name="state" value={billingInfo.state} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div className="form-group">
                    <label>ZIP Code</label>
                    <input type="text" name="zip" value={billingInfo.zip} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div className="form-group">
                    <label>Payment Method</label>
                    <select name="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required disabled={isLoading}>
                        <option value="">Select Payment Method</option>
                        <option value="paypal">PayPal</option>
                        <option value="razorpay">Razorpay</option>
                        <option value="cod">Cash on Delivery</option>
                    </select>
                </div>
                <div className="total-amount">
                    <h3>Total Amount: ₹{totalAmount}</h3>
                </div>
                <button type="submit" className="pay-button-btn" disabled={isLoading}>Pay Now</button>
            </form>
            {paymentMethod === 'paypal' && isPayPalLoaded && <div id="paypal-button-container"></div>}
        </div>
    );
};

export default BillingPage;
