const express = require('express');
const passport = require('passport');
const router = express.Router();

const statsController = require('../controllers/stats');
const isDisinfector = require('../middleware/isDisinfector');
const isOperatorOrAdmin = require('../middleware/isOperatorOrAdmin');


// stats for disinfector
router.post('/for-disinfector', passport.authenticate('jwt', { session: false }), isDisinfector, statsController.statsForDisinfector);

module.exports = router;