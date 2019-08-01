const express = require('express');
const passport = require('passport');
const router = express.Router();

const operatorController = require('../controllers/operator');
const isOperatorOrAdmin = require('../middleware/isOperatorOrAdmin');

router.post('/get-sorted-orders', passport.authenticate('jwt', { session: false }), isOperatorOrAdmin, operatorController.getSortedOrders);

module.exports = router;