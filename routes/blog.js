const path = require('path');
const express = require('express');
const router = express.Router();
const { createPost, updatePost, deletePost } = require(path.join(
  __dirname,
  '../controllers/blog'
));

router.post('/create', createPost);
router.post('/:id/update', updatePost);
router.delete('/:id/delete', deletePost);

module.exports = router;
