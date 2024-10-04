import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Productshow.css'; // Use the same styling as in ProductShow or adjust as needed
import LoadingSpinner from './LoadingSpinner'; // Spinner for loading

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const getQuery = () => {
    return new URLSearchParams(location.search).get('query'); // Get the search term from the URL
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const searchTerm = getQuery();

      try {
        setLoading(true);

        const response = await axios.get(`http://localhost:5000/api/products?query=${searchTerm}`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('Failed to load search results.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  return (
    <div className="search-results">
      <h2>Search Results for "{getQuery()}"</h2>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product-item">
              <img src={`https://ogya.onrender.com/uploads/${product.images[0]}`} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
              <p>{product.description}</p>
            </div>
          ))
        ) : (
          <p>No products found for your search term.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
