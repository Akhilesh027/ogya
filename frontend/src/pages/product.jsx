import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Product.css";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://ogya.onrender.com/api/products");
        const fetchedProducts = response.data.map((product) => {
          // Clean and extract the image filename from the array
          const imageUrl = Array.isArray(product.images) && product.images.length > 0 
            ? product.images[0].replace(/[\[\]"]/g, '') // Remove any brackets and quotes if present
            : ''; 
          return { ...product, imageUrl };
        });
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <section className="products-page">
      <h2>Our Products</h2>
      {/* <p>
        Transform your space into a serene sanctuary with Ogya Agarbathi’s range
        of 100% natural incense sticks. Each stick is meticulously crafted using
        the finest ingredients, sourced sustainably to ensure purity and
        authenticity. Our incense sticks are free from harmful chemicals and
        synthetic additives, offering a clean, soothing burn that enhances your
        well-being.
      </p> */}
      <div className="products-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img
                src={`https://ogya.onrender.com/uploads/${product.images}`} // Updated to handle URL construction
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
    </section>
  );
};

export default Products;
