const path = require('path');
const express = require('express');
const router = express.Router();
const { createPost } = require(path.join(__dirname, '../controllers/blog'));

router.post('/create', createPost);

module.exports = router;
