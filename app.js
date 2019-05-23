var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var session = require('express-session');
var flash = require('connect-flash');
const mongoose = require('mongoose');
var favicon = require('serve-favicon');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var gameRouter = require('./routes/game');

var app = express();

// DB Config
const db = require('./config/keys').MongoURI;

// Connect dis Mongo
mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.engine('hbs', hbs( { extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts', partialsDir: __dirname + '/views/layouts/partials'}));
app.set('views', path.join(__dirname, 'views/layouts'));
app.set('view engine', 'hbs');

app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'SECRET',
    resave: false,
    saveUninitialized: false
}));

app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(express.static('public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/game', gameRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

module.exports = app;