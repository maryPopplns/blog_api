const path = require('path');
const express = require('express');
const router = express.Router();
const {
  createPost,
  updatePost,
  deletePost,
  incrementPostLikes,
  decrementPostLikes,
  commentPost,
} = require(path.join(__dirname, '../controllers/blog'));

router.post('/create', createPost);
router.put('/:id/update', updatePost);
router.delete('/:id/delete', deletePost);
router.put('/:id/increment', incrementPostLikes);
router.put('/:id/decrement', decrementPostLikes);
router.post('/:id/comment', commentPost);

module.exports = router;
