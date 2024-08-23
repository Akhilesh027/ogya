import React, { createContext, useState } from 'react';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Add product to cart or update its quantity if it already exists
    const addToCart = (product) => {
        const existingProductIndex = cartItems.findIndex(item => item.id === product.id);

        if (existingProductIndex >= 0) {
            // If product exists, update the quantity
            const updatedCartItems = cartItems.map((item, index) =>
                index === existingProductIndex
                    ? { ...item, quantity: item.quantity + product.quantity }
                    : item
            );
            setCartItems(updatedCartItems);
        } else {
            // If product doesn't exist, add it to the cart
            setCartItems([...cartItems, product]);
        }
    };

    // Remove product from cart
    const removeFromCart = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    // Get total quantity of items in the cart
    const getTotalQuantity = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Get total amount of the cart
    const getTotalAmount = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeFromCart, getTotalQuantity, getTotalAmount }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
