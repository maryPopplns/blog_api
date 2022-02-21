const path = require('path');
const express = require('express');
const router = express.Router();
const { createBlogPost } = require(path.join(__dirname, '../controllers/blog'));

router.get('/createBlogPost', createBlogPost);

module.exports = router;
