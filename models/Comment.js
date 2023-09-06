const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init(
  {
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE, // Include createdAt field
      allowNull: false,
      defaultValue: DataTypes.NOW, // Set a default value for createdAt
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    timestamps: true, // Enable timestamps
    modelName: 'comment',
    
  }
);

module.exports = Comment;
