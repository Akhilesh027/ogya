// Example Product model
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Database/db'); // Adjust path as needed

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  images: {
    type: DataTypes.TEXT, // Use TEXT or JSON type to store image paths
    allowNull: true
  }
});

module.exports = Product;
