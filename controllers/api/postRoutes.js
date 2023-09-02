const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

// Create a New Blog Post Route
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      body: req.body.body,
      userId: req.session.user_id,
    });

    res.json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Update a Blog Post Route
router.put('/:id', withAuth, async (req, res) => {
  try {
    const updatedPost = await Post.update(
      {
        title: req.body.title,
        body: req.body.body,
      },
      {
        where: { id: req.params.id },
      }
    );

    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Delete a Blog Post Route
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const deletedPost = await Post.destroy({
      where: { id: req.params.id },
    });

    res.json(deletedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
