import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import img from './Images/icon.png'
import "./ProductsPage.css"; // Import the CSS file
import Footer from "./footer";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://ogya.onrender.com/api/products");
        // Ensure that imageUrl is handled correctly, assuming it's a single URL for simplicity
        const fetchedProducts = response.data.map((product) => ({
          ...product,
          imageUrl: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '', // Handle images as array
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }finally{
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return <div className="loading">Loading products...</div>; // Loading message or spinner
  }

  return (
    <section className="products-page-home">
      <h2>Our Products</h2>
      {/* <p>
        Transform your space into a serene sanctuary with Ogya Agarbathi’s range
        of 100% natural incense sticks. Each stick is meticulously crafted using
        the finest ingredients, sourced sustainably to ensure purity and
        authenticity. Our incense sticks are free from harmful chemicals and
        synthetic additives, offering a clean, soothing burn that enhances your
        well-being.
      </p> */}
      <div className="products-container-home">
        {products.map((product) => (
          <div key={product.id} className="product-card-home">
            <div className="product-image-home">
              <img
                src={`https://ogya.onrender.com/uploads/${product.images}`} // Updated to handle URL construction
                alt={product.name}
              />
              <div className="product-details-home">
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
    
    </section>
  );
};

export default Products;
