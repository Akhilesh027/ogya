// models/PaymentDetail.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Database/db'); // Adjust path as needed

module.exports = (sequelize, DataTypes) => {
    const PaymentDetail = sequelize.define("PaymentDetail", {
      orderId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Orders", // references the Orders table
          key: "id",
        },
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null for COD payments
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    return PaymentDetail;
  };
  