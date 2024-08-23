import React, { useState } from 'react';
import axios from 'axios';
import './product.css'; // Import the CSS file

const ProductPost = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [imageFiles, setImageFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('description', product.description);
    
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('images', imageFiles[i]);
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data); // Log response from server
      alert('Product uploaded successfully');
      setProduct({ name: '', price: '', description: '' });
      setImageFiles([]);
    } catch (error) {
      console.error('Error uploading product:', error);
      alert('Error uploading product. Please try again.');
    }
  };

  return (
    <div className="admin-product">
      <h1>Upload Product</h1>
      <form onSubmit={handleSubmit} className="admin-product">
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="images">Images:</label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Upload Product</button>
      </form>
    </div>
  );
};

export default ProductPost;
