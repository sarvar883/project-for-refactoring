const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const passport = require('passport');

router.post('/login', authController.loginUser);

router.post('/register', authController.registerUser);

// @desc    Return current user
router.get('/current', authController.currentUser);

module.exports = router;