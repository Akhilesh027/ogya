import React from 'react';
import './orderSummary.css';

const OrderSummary = ({ cartItems, totalAmount, onSubmit }) => {
    return (
        <div className="order-summary-page">
            <h2>Your order</h2>
            <div className="order-summary">
                {cartItems.map((item) => (
                    <div key={item.id} className="order-item">
                        <div>{item.name} × {item.quantity}</div>
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
            <button onClick={onSubmit} className="next-btn">Proceed to Payment</button>

            {/* Additional content section */}
            <div className="additional-content">
                <p>Thank you for shopping with us!</p>
                <p>Your satisfaction is our priority.</p>
                <p>If you have any questions, feel free to contact our support team.</p>
            </div>
        </div>
    );
};

export default OrderSummary;
