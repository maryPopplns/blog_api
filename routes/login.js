const path = require('path');
const express = require('express');
const router = express.Router();
const {
  login_local_post,
  login_google_get,
  login_google_success_get,
} = require(path.join(__dirname, '../controllers/login'));

router.post('/local', login_local_post);
router.get('/google', login_google_get);
router.get('/google/success', login_google_success_get);

module.exports = router;
