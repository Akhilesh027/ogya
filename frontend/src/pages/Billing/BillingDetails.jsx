import React from 'react';
import './billing.css'
const BillingDetails = ({ formData, setFormData, onSubmit }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="billing">
            <h2>Billing details</h2>
            {/* Billing Details Form Fields */}
            <label>First name *</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />

            <label>Last name *</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />

            <label>Country / Region *</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} required />

            <label>Street address *</label>
            <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleChange} required />

            <label>Town / City *</label>
            <input type="text" name="townCity" value={formData.townCity} onChange={handleChange} required />

            <label>State *</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} required />

            <label>PIN Code *</label>
            <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} required />

            <label>Phone *</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

            <label>Email address *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <button type="submit" className="next-btn">Next</button>
        </form>
    );
};

export default BillingDetails;
