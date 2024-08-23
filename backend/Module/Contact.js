// db.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Database/db');

const Contact = sequelize.define('Contact', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phonenumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'contacts',
});

sequelize.sync();

module.exports = {
  sequelize,
  Contact,
};
