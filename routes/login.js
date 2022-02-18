const path = require('path');
const passport = require('passport');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { check } = require('express-validator');
const { logger } = require(path.join(__dirname, '../logger/logger.js'));
const { login_local } = require(path.join(__dirname, '../controllers/login'));

router.post('/local', login_local);

module.exports = router;
