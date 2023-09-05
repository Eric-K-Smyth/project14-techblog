const router = require('express').Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const commentRoutes = require('./commentRoutes');

// Prefix all API routes with '/users'
router.use('/user', userRoutes);

// Prefix all API routes with '/posts'
router.use('/posts', postRoutes);

// Prefix all API routes with '/comments'
router.use('/comments', commentRoutes);

module.exports = router;