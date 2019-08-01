const express = require('express');
const passport = require('passport');
const router = express.Router();

const orderController = require('../controllers/order');
const isDisinfector = require('../middleware/isDisinfector');
const isOperatorOrAdmin = require('../middleware/isOperatorOrAdmin');

// get all disinfectors for Order component
router.get('/get-all-disinfectors', passport.authenticate('jwt', { session: false }), orderController.getAllDisinfectors);

// create order
router.post('/create-order', passport.authenticate('jwt', { session: false }), isOperatorOrAdmin, orderController.createOrder);

// get orders for logged in disinfector
router.post('/get-my-orders', passport.authenticate('jwt', { session: false }), isDisinfector, orderController.getOrders);

// add disinfector comment to order
router.post('/addDisinfectorComment', passport.authenticate('jwt', { session: false }), isDisinfector, orderController.addDisinfectorComment);

module.exports = router;