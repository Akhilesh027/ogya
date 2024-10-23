const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Database/db');

const BillingDetails = sequelize.define('BillingDetails', {
  userId: {  // Add userId field
    type: DataTypes.INTEGER,
    allowNull: false,
},
firstName: {
    type: DataTypes.STRING,
    allowNull: false,
},
lastName: {
    type: DataTypes.STRING,
    allowNull: false,
},
country: {
    type: DataTypes.STRING,
    allowNull: false,
},
streetAddress: {
    type: DataTypes.STRING,
    allowNull: false,
},
townCity: {
    type: DataTypes.STRING,
    allowNull: false,
},
state: {
    type: DataTypes.STRING,
    allowNull: false,
},
pinCode: {
    type: DataTypes.STRING,
    allowNull: false,
},
phone: {
    type: DataTypes.STRING,
    allowNull: false,
},
email: {
    type: DataTypes.STRING,
    allowNull: false,
},
paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
},
transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
},
paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
},
amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
},
});

module.exports = BillingDetails;
