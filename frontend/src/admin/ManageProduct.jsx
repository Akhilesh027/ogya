import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ManageProducts.css'; // Import the CSS file

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      setProducts(products.filter(product => product.id !== productId));
      alert('Product deleted successfully');
    } catch (error) {
      alert('Error deleting product. Please try again.');
      console.error('Error deleting product:', error);
    }
  };

  return (
    <section className="products-page">
      <h2>Our Products</h2>
      <div className="products-container">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={`http://localhost:5000/uploads/${product.images}`}alt={product.name} />
            </div>
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
              <button className='delete-button'><Link to={`/edit-product/${product.id}`} className='edit'>Edit</Link></button>
              <button onClick={() => handleDelete(product.id)} className="delete-button">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;
