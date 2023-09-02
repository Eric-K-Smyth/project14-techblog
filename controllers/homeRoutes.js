const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Home Page Route (Display Existing Blog Posts)
router.get('/', async (req, res) => {
  try {
    // Fetch all blog posts and associated user data
    const postData = await Post.findAll({
      include: [{ model: User, attributes: ['username'] }],
    });

    // Serialize the data
    const posts = postData.map((post) => post.get({ plain: true }));

    // Render the home page with the posts data
    res.render('homepage', { posts, logged_in: req.session.logged_in });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Dashboard Route (Display User's Blog Posts)
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Fetch the user's blog posts and associated user data
    const postData = await Post.findAll({
      where: { userId: req.session.user_id },
      include: [{ model: User, attributes: ['username'] }],
    });

    // Serialize the data
    const posts = postData.map((post) => post.get({ plain: true }));

    // Render the dashboard with the user's posts data
    res.render('dashboard', { posts, logged_in: req.session.logged_in });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// User Profile Route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Fetch the logged-in user's data and associated blog posts
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    // Serialize the data
    const user = userData.get({ plain: true });

    // Render the user's profile with their data
    res.render('profile', { user, logged_in: true });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

