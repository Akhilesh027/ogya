import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import BillingDetails from './BillingDetails';
import OrderSummary from './OrderSummary';
import Payment from './Payment';

const Checkout = () => {
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

    const [cartItems, setCartItems] = useState([
        // Example data, replace with actual cart data
        { id: 1, name: "Item 1", price: 100, quantity: 2 },
        { id: 2, name: "Item 2", price: 200, quantity: 1 },
    ]);

    const [totalAmount, setTotalAmount] = useState(400); // Replace with actual total amount

    const navigate = useNavigate();

    const handleBillingSubmit = (data) => {
        setFormData(data);
        navigate('/checkout/order-summary');
    };

    const handleOrderSubmit = () => {
        navigate('/checkout/payment');
    };

    return (
        <Routes>
            <Route path="/" element={<BillingDetails formData={formData} setFormData={setFormData} onSubmit={handleBillingSubmit} />} />
            <Route path="/order-summary" element={<OrderSummary cartItems={cartItems} totalAmount={totalAmount} onSubmit={handleOrderSubmit} />} />
            <Route path="/payment" element={<Payment formData={formData} cartItems={cartItems} totalAmount={totalAmount} />} />
        </Routes>
    );
};

export default Checkout;
