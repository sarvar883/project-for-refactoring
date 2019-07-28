const express = require('express');
const passport = require('passport');
const router = express.Router();

const operatorController = require('../controllers/operator');

router.post('/get-sorted-orders', passport.authenticate('jwt', { session: false }), operatorController.getSortedOrders);

module.exports = router;