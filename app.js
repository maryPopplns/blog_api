const fs = require('fs');
const path = require('path');
const logger = require('morgan');
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');

const indexRouter = require(path.join(__dirname, 'routes/index'));
const loginRouter = require(path.join(__dirname, 'routes/login'));

const app = express();

// TODO enable CORS

// [ MONGO CONNECTION ]
require(path.join(__dirname, '/config/database'));

// [ LOG REQUESTS ]
const stream = fs.createWriteStream(
  path.join(__dirname, 'logger/access/access.log'),
  { flags: 'a' }
);
app.use(logger('combined', { stream }));

// [ MIDDLEWARE ]
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// [ AUTHENTICATION ]
require(path.join(__dirname, '/config/passport'));

// [ ROUTES ]
app.use('/', indexRouter);
app.use('/login', loginRouter);

// [ 404 ]
app.use(function (req, res, next) {
  next(createError(404));
});

// [ ERROR HANDLING ]
app.use(function (error, req, res, next) {
  res.status(err.status || 500);
  res.json({ error });
});

module.exports = app;
