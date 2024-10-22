import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Productshow.css';
import { CartContext } from './CartContext';
import Products from './product';
import LoadingSpinner from './LoadingSpinner.jsx'; // Assuming you have a spinner component
import Footer from './footer.jsx';

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
        setLoading(true); // Start loading
        const response = await axios.get(`https://ogya.onrender.com/api/offers/${id}`);
        setProduct(response.data);
        setLoading(false); // Stop loading
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to load product details. Please try again later.');
        setLoading(false); // Stop loading
      }
    };

    const fetchOtherProducts = async () => {
      try {
        const response = await axios.get('https://ogya.onrender.com/api/offer'); // Fetch all products
        const filteredProducts = response.data.filter((item) => item._id !== id);
        setOtherProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching other products:', error);
      }
    };

    fetchProduct();
    fetchOtherProducts();
  }, [id]);

  const handleQuantityChange = (operation) => {
    if (operation === 'increment') {
      setQuantity(quantity + 1);
    } else if (operation === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
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

  if (loading) return <LoadingSpinner />; // Display a loading spinner while loading
  if (error) return <p>{error}</p>;

  // Ensure product.images is an array before using .map
  const images = Array.isArray(product.images) ? product.images : [];

  return (
    <>
      <section className="product-detail">
        <div className="product-images">
          <div className="main-image">
            <img
              src={`https://ogya.onrender.com/uploads/${images[activeThumbnail]}`}     
              alt={`${product.name} - Main`}
            />
          </div>
          <div className="thumbnail-images">
            {images.map((image, index) => (
              <img
                key={index}
                src={`https://ogya.onrender.com/uploads/${image}`}
                alt={`${product.name} - Thumbnail ${index + 1}`}
                className={activeThumbnail === index ? 'active-thumbnail' : ''}
                onClick={() => setActiveThumbnail(index)}
              />
            ))}
          </div>
        </div>
        <div className="description">
          <h2>{product.name}</h2>
          {product.id === 10 && (
            <p className='diff'>Fragrance Pack: 6 Combo 2+2+2 Lavender, Rose, Jasmine.</p>
          )}
          <p>Price: ₹{product.price}</p>
          <p>{product.description}</p>
          {product.id === 9 && (
            <p>Order Now and bring home the fragrance of tranquility.</p>
          )}
          {product.id === 11 && (
            <p>Order Now and embrace the purity of Tulasi Chandan, Guggal and Mogra.</p>
          )}
          <div className="product-actions">
            <label htmlFor="quantity">Quantity:</label>
            <div className="quantity-control">
              <button className="btn-quantity" onClick={() => handleQuantityChange('decrement')}>-</button>
              <span className="quantity-display">{quantity}</span>
              <button className="btn-quantity" onClick={() => handleQuantityChange('increment')}>+</button>
            </div>
            <button className="btn" onClick={handleAddToCart}>Add to Cart</button>
            <button className="btn" onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
      </section>
      <Footer/>
      {/* Uncomment if you want to display other products */}
      {/* <div className="other-products-section">
        <Products products={otherProducts} />
      </div> */}
    </>
  );
}

export default Productshow;
