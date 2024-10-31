// models/Post.js
const { DataTypes } = require("sequelize");
const sequelize = require("../Database/db");

const Post = sequelize.define("Post", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
    },
});

module.exports = Post;
