var express = require('express');
var path = require('path');
var cors = require('cors');
var passport = require('passport');
var bodyParser = require('body-parser');

var auth = require('./routes/auth');
var index = require('./routes/index');
var news = require('./routes/news');
var user = require('./routes/user');
var click = require('./routes/click');

var app = express();

var config = require('./config/config.json');
require('./models/main.js').connect(config.mongoDbUri);

// view engine setup
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '../client/build/'));

app.use('/static', express.static(path.join(__dirname, '../client/build/static/')));
app.use(bodyParser.json());

//load passport strategies
app.use(passport.initialize());
var localSignupStrategy = require('./passport/signup_passport');
var localLoginStrategy = require('./passport/login_passport');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// TODO: remove this after development is done.
app.use(cors());

app.use('/', index);
app.use('/login', index);
app.use('/signup', index);
app.use('/logout', index);
app.use('/topics', index);
app.use('/search', index);
app.use('/profile/preference', index);
app.use('/user', index);
app.use('/auth', auth);

// pass the authentication checker middleware
const authCheckMiddleware = require('./middleware/auth_checker');
app.use('/news', authCheckMiddleware);
app.use('/news', news);

app.use('/user', authCheckMiddleware);
app.use('/user', user);

app.use('/click', authCheckMiddleware);
app.use('/click', click);

// catch 404 and forward to error handler
app.use(function(req, res) {
  var err = new Error('Not Found');
  err.status = 404;
  res.send('404 Not Found');
});

module.exports = app;