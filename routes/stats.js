const express = require('express');
const passport = require('passport');
const router = express.Router();

const statsController = require('../controllers/stats');
const isDisinfector = require('../middleware/isDisinfector');
const isOperatorOrAdmin = require('../middleware/isOperatorOrAdmin');

// comprehensive statistics for operator or admin
router.post('/for-operator', passport.authenticate('jwt', { session: false }), isOperatorOrAdmin, statsController.statsForOperator);

module.exports = router;