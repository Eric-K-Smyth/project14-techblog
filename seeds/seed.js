const { User, Post, Comment } = require('../models');
const userData = require('./userdata.json');
const commentData = require('./commentdata.json'); // Use the new comment data JSON file

const seedDatabase = async () => {
  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const projectData = require('./projectdata.json');
  await Post.bulkCreate(projectData);

  await Comment.bulkCreate(commentData);
};

seedDatabase();
