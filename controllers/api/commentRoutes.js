const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Create a New Comment Route
router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      body: req.body.body,
      userId: req.session.user_id,
      postId: req.body.postId,
    });

    res.json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Delete a Comment Route
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const deletedComment = await Comment.destroy({
      where: { id: req.params.id },
    });

    res.json(deletedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
