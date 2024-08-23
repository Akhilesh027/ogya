// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('project1', 'root', 'BANNU', {
//   host: 'localhost',
//   dialect: 'mysql',
// });

// module.exports = sequelize;


const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('u567147732_ogya', 'u567147732_ogya', 'OGYA@2004@ogya', {
  host: '193.203.184.84',
  dialect: 'mysql',
});

module.exports = sequelize;