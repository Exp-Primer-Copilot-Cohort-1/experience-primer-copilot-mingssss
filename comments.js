// Create web server

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const port = 3000;

// Set up session
app.use(cookieParser('secret'));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.use(flash());

// Set up body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Set up static files
app.use(express.static('public'));

// Set up comments array
const comments = [
  {
    name: 'Stuart',
    comment: 'I love this article!'
  },
  {
    name: 'Dave',
    comment: 'I do not love this article!'
  }
];

// Set up routes
app.get('/', (req, res) => {
  res.render('index', { comments: comments, errors: req.flash('errors') });
});

app.post('/', [
  body('name').not().isEmpty().withMessage('Name is required.'),
  body('comment').not().isEmpty().withMessage('Comment is required.')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach(error => {
      req.flash('errors', error.msg);
    });
    res.redirect('/');
  } else {
    comments.push(req.body);
    res.redirect('/');
  }
});

// Set up server
app.listen(port, () => console.log(`Listening on port ${port}`));