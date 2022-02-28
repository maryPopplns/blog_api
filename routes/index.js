const path = require('path');
const express = require('express');
const router = express.Router();
const { homepage } = require(path.join(__dirname, '../controllers/index'));

router.get('/', homepage);

module.exports = router;
