const path = require('path');
const express = require('express');
const router = express.Router();
const { login_local_post, login_google_post } = require(path.join(
  __dirname,
  '../controllers/login'
));

router.post('/local', login_local_post);
router.post('/google', login_google_post);

module.exports = router;
