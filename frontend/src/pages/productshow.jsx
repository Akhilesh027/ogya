import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Productshow.css';
import { CartContext } from './CartContext';
import products from './productsdata.jsx'; // Import your local product data
import LoadingSpinner from './LoadingSpinner.jsx'; // Assuming you have a spinner component
import Footer from './footer.jsx';

const Productshow = () => {
  const [product, setProduct] = useState(null);
  const [otherProducts, setOtherProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(6); // Set initial quantity to 6 as per requirement
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchedProduct = products.find((prod) => prod.id === parseInt(id)); // Find product by ID

    if (fetchedProduct) {
      setProduct(fetchedProduct);
      setOtherProducts(products.filter((item) => item.id !== parseInt(id))); // Get other products excluding the current one
      setLoading(false);
    } else {
      setError('Product not found.');
      setLoading(false);
    }
  }, [id]);

  const handleQuantityChange = (operation) => {
    if (operation === 'increment') {
      setQuantity(quantity + 1);
    } else if (operation === 'decrement' && quantity > 6) { // Ensure minimum quantity is 6
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (quantity < 6) {
      alert('You cannot buy less than 6 quantities of this product.');
      return;
    }
    addToCart({ ...product, quantity });
    alert('Product added to cart successfully!');
  };

  const handleBuyNow = () => {
    if (quantity < 6) {
      alert('You cannot buy less than 6 quantities of this product.');
      return;
    }
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

  return (
    <>
      <section className="product-detail">
        <div className="product-images">
          <div className="main-image">
            <img
              src={product.images} // Directly use the single image property
              alt={`${product.name} - Main`}
            />
          </div>
        </div>
        <div className="description">
          <h2>{product.name}</h2>
          <p>Price: ₹{product.price}</p>
          <p>{product.description}</p>
          <div className="product-actions">
            <label htmlFor="quantity">Quantity: <span>Min quantity is 6 items</span></label>
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

      {/* Uncomment if you want to display other products */}
      {/* <div className="other-products-section">
        <Products products={otherProducts} />
      </div> */}
      <Footer />
    </>
  );
};

export default Productshow;
