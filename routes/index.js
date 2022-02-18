const path = require('path');
const express = require('express');
const router = express.Router();
const { index_get } = require(path.join(__dirname, '../controllers/index'));

router.get('/', index_get);

module.exports = router;
