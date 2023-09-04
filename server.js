const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const { User } = require('./models'); // Import the User model

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

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
