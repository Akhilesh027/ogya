import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Productshow.css';
import { CartContext } from './CartContext';
import Products from './product';

const Productshow = () => {
  const [product, setProduct] = useState(null);
  const [otherProducts, setOtherProducts] = useState([]);
  const [activeThumbnail, setActiveThumbnail] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };

    const fetchOtherProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products'); // Fetch all products
        const filteredProducts = response.data.filter((item) => item._id !== id);
        setOtherProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching other products:', error);
      }
    };

    fetchProduct();
    fetchOtherProducts();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Number(e.target.value)); // Ensure minimum quantity of 1
    setQuantity(value);
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    alert('Product added to cart successfully!');
  };

  const handleBuyNow = () => {
    const totalAmount = product.price * quantity;
    navigate('/buy', {
      state: {
        cartItems: [{ ...product, quantity }],
        totalAmount,
      },
    });
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;

  // Ensure product.images is an array before using .map
  const images = Array.isArray(product.images) ? product.images : [];

  return (
    <>
      <section className="product-detail">
        <div className="product-images">
          <div className="main-image">
            
              <img
              src={`http://localhost:5000/uploads/${product.images}`}     
              alt={`${product.name} - Main`}
              />
            
          </div>
          <div className="thumbnail-images">
            {images.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:5000/uploads/${image}`}
                alt={`${product.name} - Thumbnail ${index + 1}`}
                className={activeThumbnail === index ? 'active-thumbnail' : ''}
                onClick={() => setActiveThumbnail(index)}
              />
            ))}
          </div>
        </div>
        <div className="description">
          <h2>{product.name}</h2>
          <p>Price: ₹{product.price}</p>
          <p>{product.description}</p>
          <div className="product-actions">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              min="1"
              onChange={handleQuantityChange}
            />
            <button className="btn" onClick={handleAddToCart}>Add to Cart</button>
            <button className="btn" onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
      </section>

      {/* Uncomment if you want to display other products */}
      {/* <div className="other-products-section">
        <Products products={otherProducts} />
      </div> */}
    </>
  );
}

export default Productshow;
