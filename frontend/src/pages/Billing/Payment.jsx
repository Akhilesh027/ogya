import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Payment.css'; // Import the CSS file

const Payment = ({ formData, cartItems, totalAmount }) => {
    const [paymentMethod, setPaymentMethod] = useState('paypal');
    const [isPayPalLoaded, setIsPayPalLoaded] = useState(false);

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
        script.src = "https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID";
        script.onload = () => setIsPayPalLoaded(true);
        document.body.appendChild(script);
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handlePaymentSuccess = async (paymentDetails) => {
        const orderData = {
            ...formData,
            paymentMethod: paymentDetails.paymentMethod,
            transactionId: paymentDetails.transactionId,
            paymentStatus: paymentDetails.paymentStatus,
            amount: paymentDetails.amount,
        };

        try {
            const response = await axios.post('https://ogya.onrender.com/api/billing', orderData);
            if (response.status === 201) {
                alert('Order successfully completed');
                // Redirect or perform further actions
            }
        } catch (error) {
            console.error('Error recording order details:', error);
        }
    };

    const handlePayment = (e) => {
        e.preventDefault();

        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        if (paymentMethod === 'razorpay') {
            handleRazorpayPayment();
        } else if (paymentMethod === 'paypal') {
            if (!isPayPalLoaded) {
                alert('PayPal is not loaded yet. Please try again.');
                return;
            }
            handlePayPalPayment();
        } else if (paymentMethod === 'cod') {
            handlePaymentSuccess({
                orderId: Date.now(),
                paymentMethod: 'Cash on Delivery',
                paymentStatus: 'Pending',
                transactionId: null,
                amount: totalAmount,
            });
        }
    };

    const handleRazorpayPayment = () => {
        const options = {
            key: "YOUR_RAZORPAY_KEY_ID",
            amount: totalAmount * 100,
            currency: "INR",
            name: "Your Company",
            description: "Test Transaction",
            handler: function (response) {
                handlePaymentSuccess({
                    orderId: response.razorpay_order_id,
                    paymentMethod: 'Razorpay',
                    paymentStatus: 'Completed',
                    transactionId: response.razorpay_payment_id,
                    amount: totalAmount,
                });
            },
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone,
            },
            theme: {
                color: "#3399cc",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const handlePayPalPayment = () => {
        window.paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            currency_code: "USD",
                            value: (totalAmount / 74).toFixed(2), // Approximate conversion rate
                        },
                    }],
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                    handlePaymentSuccess({
                        orderId: data.orderID,
                        paymentMethod: 'PayPal',
                        paymentStatus: 'Completed',
                        transactionId: details.id,
                        amount: totalAmount,
                    });
                });
            },
        }).render('#paypal-button-container');
    };

    return (
        <div className="payment-page">
            <div className="payment-container">
                <h2>Payment</h2>
                <form onSubmit={handlePayment}>
                    <div className="payment-method">
                        <label className={`payment-option ${paymentMethod === 'razorpay' ? 'selected' : ''}`}>
                            <input 
                                type="radio" 
                                value="razorpay" 
                                checked={paymentMethod === 'razorpay'} 
                                onChange={handlePaymentChange} 
                            />
                            Pay with Razorpay
                        </label>
                        <label className={`payment-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}>
                            <input 
                                type="radio" 
                                value="paypal" 
                                checked={paymentMethod === 'paypal'} 
                                onChange={handlePaymentChange} 
                            />
                            Pay with PayPal
                        </label>
                        <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                            <input 
                                type="radio" 
                                value="cod" 
                                checked={paymentMethod === 'cod'} 
                                onChange={handlePaymentChange} 
                            />
                            Cash on Delivery
                        </label>
                    </div>

                    {paymentMethod === 'paypal' && <div id="paypal-button-container" className="paypal-container"></div>}

                    <button type="submit" className="pay-btn">Complete Payment</button>
                </form>
            </div>
        </div>
    );
};

export default Payment;
