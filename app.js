const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const express = require('express');
const requestLogger = require('morgan');
const compression = require('compression');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const { logger } = require(path.join(__dirname, '/logger/logger.js'));

const indexRouter = require(path.join(__dirname, 'routes/index'));
const loginRouter = require(path.join(__dirname, 'routes/login'));
const blogRouter = require(path.join(__dirname, 'routes/blog'));

const app = express();

// TODO enable CORS

// [ MONGO CONNECTION ]
require(path.join(__dirname, '/config/database'));

// [ LOG REQUESTS ]
const stream = fs.createWriteStream(
  path.join(__dirname, 'logger/access/access.log'),
  { flags: 'a' }
);
app.use(requestLogger('combined', { stream }));

// [ MIDDLEWARE ]
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// [ CLEAR COOKIES ]
app.use((req, res, next) => {
  res.clearCookie('token');
  next();
});

// [ AUTHENTICATION ]
require(path.join(__dirname, '/config/passport'));

// [ ROUTES ]
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/blog', blogRouter);

// [ 404 ]
app.use(function (req, res, next) {
  next(createError(404));
});

// [ ERROR HANDLING ]
app.use(function (error, req, res, next) {
  logger.error(`${error}`);
  res.status(error.status || 500);
  res.json({ error: `${error}` });
});

module.exports = app;
