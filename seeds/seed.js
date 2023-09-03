// seed.js
const { User, Post, Comment } = require('../models');
const userData = require('./userdata.json');
const commentData = require('./commentdata.json'); // Use the new comment data JSON file

const seedDatabase = async () => {
  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  // Assuming you still have a projectData JSON file for blog posts
  const projectData = require('./projectdata.json');
  await Post.bulkCreate(projectData);

  await Comment.bulkCreate(commentData);
};

seedDatabase();
