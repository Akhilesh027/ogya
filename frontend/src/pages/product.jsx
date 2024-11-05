import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import products from './productsdata'; // Import your product data
import "./Product.css"; // Ensure your CSS file is correctly linked
import Footer from "./footer";
import icon from "./Images/icon.png";

const Products = () => {
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Simulating fetch with local data
    const fetchProducts = () => {
      setLoading(true); // Start loading state
      try {
        if (products.length === 0) {
          throw new Error("No products found.");
        }
        setLoading(false); // End loading state
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later."); // Set error message
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return <div className="loading">Loading products...</div>; // Loading message or spinner
  }

  if (error) {
    return <div className="error-message">{error}</div>; // Display error message
  }

  return (
    <section className="products-page">
      <div className="head">
        <img className="icon" src={icon} alt="icon" />
        <h2>Our Products</h2>
        <img className="icon" src={icon} alt="icon" />
      </div>
      <div className="products-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img
                src={product.images} // Use the image directly from product data
                alt={product.name}
              />
              <div className="product-details">
                <h3>{product.name}</h3>
                <p>Price: ₹{product.price}</p>
                <Link
                  to={`/product/${product.id}`}
                  className="view-product-button"
                >
                  View Product
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </section>
  );
};

export default Products;
