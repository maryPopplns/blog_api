const fs = require('fs');
const path = require('path');
const logger = require('morgan');
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const indexRouter = require(path.join(__dirname, 'routes/index'));

const app = express();

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

// [ ROUTES ]
app.use('/', indexRouter);

// [ 404 ]
app.use(function (req, res, next) {
  next(createError(404));
});

// [ ERROR HANDLING ]
app.use(function (err, req, res, next) {
  // TODO create error handling
  //
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  // res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
