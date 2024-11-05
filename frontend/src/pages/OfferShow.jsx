import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Productshow.css';
import { CartContext } from './CartContext';
import products from './comboproducts.jsx'; // Import the static product data
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
    const selectedProduct = products.find((prod) => prod.id === parseInt(id)); // Find product by ID
    if (selectedProduct) {
      setProduct(selectedProduct);
      setLoading(false);
    } else {
      setError('Product not found');
      setLoading(false);
    }
    // You can set otherProducts here if desired
    const filteredProducts = products.filter((item) => item.id !== parseInt(id));
    setOtherProducts(filteredProducts);
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
              src={product.images}     
              alt={`${product.name} - Main`}
            />
          </div>
          
        </div>

        <div className="description">
          <h2>{product.name}</h2>
          {product.id === 2 && (
            <p className='diff'>Fragrance Pack: 6 Combo 2+2+2 Lavender, Rose, Jasmine.</p>
          )}
          {product.id === 1 && (
            <p className='diff'>Mother pack : 6 combo Mogra, Jasmine, Lavender, Tulasi Chandan, and Guggul.</p>
          )}
          {product.id === 3 && (
            <p className='diff'>Organic pack: 3 combo Tulasi Chandan, Guggal and Mogra.</p>
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
      <Footer />
      {/* Uncomment if you want to display other products */}
      {/* <div className="other-products-section">
        <Products products={otherProducts} />
      </div> */}
    </>
  );
}

export default Productshow;
