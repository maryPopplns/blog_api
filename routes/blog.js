const path = require('path');
const express = require('express');
const router = express.Router();
const { createPost, updatePost } = require(path.join(
  __dirname,
  '../controllers/blog'
));

router.post('/create', createPost);
router.post('/:id/update', updatePost);

module.exports = router;
