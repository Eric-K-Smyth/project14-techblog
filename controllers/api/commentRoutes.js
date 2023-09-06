const router = require('express').Router();
const { Comment, Post } = require('../../models');
const withAuth = require('../../utils/auth');

// Create a New Comment Route
router.post('/comment/:id', withAuth, async (req, res) => {
  try {
    const postId = req.params.id; // Extract the ID from the URL
    const { body } = req.body;

    // Create a new comment associated with the post and user
    const newComment = await Comment.create({
      body,
      userId: req.session.user_id,
      postId: postId, // Use the extracted ID
    });

    // Instead of redirecting, you can send a response indicating success
    res.status(201).json({ message: 'Comment added successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Delete a Comment Route
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentId = req.params.id;

    // Delete the comment by its ID
    await Comment.destroy({
      where: { id: commentId },
    });

    // Instead of redirecting, you can send a response indicating success
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;


