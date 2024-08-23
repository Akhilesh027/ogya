import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartDrawer = ({ isOpen, onClose }) => {
    const { cartItems, removeFromCart, getTotalQuantity, getTotalAmount } = useContext(CartContext);
    const navigate = useNavigate();

    const handleBuyNow = () => {
        onClose();
        navigate('/buy', {
            state: { 
                quantity: getTotalQuantity(),
                totalAmount: getTotalAmount(),
                cartItems  // Pass the cart items to the billing page as well
            }
        });
    };

    return (
        <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
            <button className="close-btn" onClick={onClose}>X</button>
            <h2>Your Cart</h2>
            <div className="cart-items-container">
                {cartItems.length === 0 ? (
                    <div className="cart-empty">Your cart is empty</div>
                ) : (
                    cartItems.map((item, index) => (
                        <div key={index} className="cart-item">
                            <img src={`https://ogya.onrender.com/uploads/${item.images}`} alt={item.name} />
                            <div className="cart-item-details">
                                <h3>{item.name}</h3>
                                <p>Price: ₹{item.price}</p>
                                <p>Quantity: {item.quantity}</p>
                                <button 
                                    className="delete-button" 
                                    onClick={() => removeFromCart(item.id)}
                                    aria-label="Delete item"
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {cartItems.length > 0 && (
                <>
                    <div className="cart-total">
                        <h3>Total Amount: ₹{getTotalAmount()}</h3>
                    </div>
                    <div className="buy-now-container">
                        <button className="buy-now-button" onClick={handleBuyNow}>Buy Now</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartDrawer;
