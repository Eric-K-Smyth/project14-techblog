const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Create a New Blog Post Route
router.post('/', withAuth, async (req, res) => {
  console.log('User ID from session:', req.session.user_id);
  console.log('Request Body:', req.body);
  console.log('User ID from session:', req.session.user_id);
  try {
    const newPost = await Post.create({
      title: req.body.title,
      body: req.body.body,
      userId: req.session.user_id,
    });

    console.log('Created post:', newPost); // debugging

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

    console.log('Updated post:', updatedPost); // debugging

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

    console.log('Deleted post:', deletedPost); // debugging

    res.json(deletedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Define a route to display an individual post
router.get('/:id', async (req, res) => {
  try {
    // Fetch the post by its ID, including the associated user
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['username'] },
        {
          model: Comment, // Include comments
          include: User, // Include the associated user for each comment
          attributes: ['id', 'body', 'createdAt'],
        },
      ],
      attributes: ['id', 'title', 'body', 'createdAt'],
      
    
    });

    if (!post) {
      // If the post doesn't exist, return a 404 error
      console.log('Post not found.'); // debugging
      return res.status(404).render('404');
    }

    console.log('Retrieved post:', post); // debugging

    // Render the individual post page template and pass the post data
    res.render('single-post', {
      id: post.id,
      title: post.title,
      body: post.body,
      username: post.User.username, // Access the username from the associated User model
      createdAt: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '', // Check for undefined date
      logged_in: req.session.logged_in, // Pass the logged_in status
      comments: post.Comments, // Pass the comments for the post
      
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

