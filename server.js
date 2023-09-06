const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const { User } = require('./models'); // Import the User model
const { Post } = require('./models'); // Import the Post model
const { Comment } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/login', (req, res) => {
  // Render the login page or handle the login process
  res.render('login'); 
});

app.get('/signup', (req, res) => {
  // Render the Signup page or handle the signup process
  res.render('signup'); 
});

// Define a route for the "/new-post" page
app.get('/new-post', (req, res) => {
  // Render the "new-post.handlebars" view
  res.render('new-post');
});

app.get('/post/:id', async (req, res) => {
  try {
    // Fetch the post by its ID, including the associated user
    const post = await Post.findByPk(req.params.id, {
      include: User, // Include the associated user
      attributes: ['id', 'title', 'body', 'createdAt'],
    });

    if (!post) {
      // If the post doesn't exist, return a 404 error or handle it as needed
      return res.status(404).render('404');
    }

    // Render the individual post page template and pass the post data
    res.render('single-post', {
      id: post.id, // Pass the post ID here
      title: post.title,
      body: post.body,
      username: post.User.username, // Access the username from the associated User model
      createdAt: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '', // Check for undefined date
      logged_in: req.session.logged_in, // Pass the logged_in status
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
// Define a route for fetching comments for a specific post
app.get('/comment/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    // Fetch comments for the specified post
    const comments = await Comment.findAll({
      where: { postId },
      include: User, // Include the associated user for each comment
      attributes: ['id', 'body', 'createdAt'],
    });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
app.get('/dashboard', async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.logged_in) {
      return res.redirect('/login'); // Redirect to login page if not logged in
    }

    // Fetch the user's posts
    const userPosts = await Post.findAll({
      where: {
        userId: req.session.user_id, // Filter by user ID
      },
    });

    // Serialize the data
    const posts = userPosts.map((post) => post.get({ plain: true }));

    // Render the dashboard template and pass the user's posts
    res.render('dashboard', { posts, logged_in: req.session.logged_in });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

app.post('/comment/:id', async (req, res) => {
  try {
    // Extract the post ID from the URL
    const postId = req.params.id;

    // Extract the comment body from the request body
    const { body } = req.body;

    // Create a new comment associated with the post and user
    const newComment = await Comment.create({
      body,
      userId: req.session.user_id, // Assuming you have user authentication
      postId: postId,
    });

    // Instead of redirecting, you can send a response indicating success
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


// Handle POST request to process user sign-up
app.post('/signup', async (req, res) => {
  try {
    // Extract user registration data from the request body
    const { username, password } = req.body;

    // Create a new user in your database
    const newUser = await User.create({
      username,
      password, // You should hash the password before saving it in the database
    });

    // Optionally, you can log the user in automatically upon successful sign-up
    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.username = newUser.username;
      req.session.logged_in = true;
      res.redirect('/login'); // Redirect to login page
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
// Define a route for displaying the update form
app.get('/dashboard/update/:id', async (req, res) => {
  try {
    // Fetch the post by its ID
    const post = await Post.findByPk(req.params.id);

    // Check if the post exists and belongs to the logged-in user
    if (!post || post.userId !== req.session.user_id) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Render the update form with the post data
    res.render('edit-posts', { post, logged_in: true });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Define a route for handling the update form submission
app.post('/dashboard/update/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;

    // Find the post by its ID
    const post = await Post.findByPk(postId);

    // Check if the post exists and belongs to the logged-in user
    if (!post || post.userId !== req.session.user_id) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Update the post
    await Post.update(
      { title, content },
      {
        where: { id: postId },
      }
    );

    // Redirect back to the dashboard
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


// In your route handler:
app.get('/', async (req, res) => {
  try {
    // Fetch recent blog posts including the username of the author
    const postData = await Post.findAll({
      include: [{ model: User, attributes: ['username'] }],
    });

    // Serialize the data
    const posts = postData.map((post) => post.get({ plain: true }));

    // Render the homepage template and pass the data
    res.render('homepage', { posts, logged_in: req.session.logged_in });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
