const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const passport = require('passport');

const isAdmin = require('../middleware/isAdmin');

router.post('/login', authController.loginUser);

router.post('/register', passport.authenticate('jwt', { session: false }), isAdmin, authController.registerUser);

router.post('/auth/get-disinfector-materials', passport.authenticate('jwt', { session: false }), authController.getDisinfectorMaterials);

// @desc    Return current user
router.get('/current', passport.authenticate('jwt', { session: false }), authController.currentUser);

module.exports = router;