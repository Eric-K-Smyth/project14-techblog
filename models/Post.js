const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model {}

Post.init(
  {
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    createdAt: DataTypes.DATE, // Include createdAt field
    updatedAt: DataTypes.DATE, // Include updatedAt field
  },
  {
    sequelize,
    timestamps: true, // Enable timestamps (createdAt and updatedAt)
    modelName: 'Post', // Set the model name to 'Post'
    tableName: 'Posts', // Set the table name to 'Posts'
  }
);

module.exports = Post;

