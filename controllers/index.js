const he = require('he');
const path = require('path');
const passport = require('passport');
const BlogPost = require(path.join(__dirname, '../models/blogPost'));

// [ HOME PAGE ]
exports.homepage = [
  function (req, res, next) {
    passport.authenticate('jwt', { session: false }, function (error, user) {
      if (error) {
        next(error);
      } else if (!user) {
        next();
      } else {
        req.user = user;
        next();
      }
    })(req, res);
  },
  function (req, res, next) {
    BlogPost.find()
      .lean()
      .then((blogs) => {
        const filteredBlogs = blogs.map(({ title, body }) => {
          const decoded = he.decode(body);
          return { title, body: decoded };
        });
        res.json({
          user: req.user || null,
          blogs: filteredBlogs,
        });
      })
      .catch(next);
  },
];
