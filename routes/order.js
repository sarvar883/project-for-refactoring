const express = require('express');
const passport = require('passport');
const router = express.Router();

const orderController = require('../controllers/order');
const isDisinfector = require('../middleware/isDisinfector');
const isOperatorOrAdmin = require('../middleware/isOperatorOrAdmin');
const isAdmin = require('../middleware/isAdmin');

// get all disinfectors for Order component
router.get('/get-all-disinfectors', passport.authenticate('jwt', { session: false }), orderController.getAllDisinfectors);

// create order
router.post('/create-order', passport.authenticate('jwt', { session: false }), isOperatorOrAdmin, orderController.createOrder);

// edit order
router.post('/edit', passport.authenticate('jwt', { session: false }), isAdmin, orderController.editOrder);

// delete order
router.post('/delete-order', passport.authenticate('jwt', { session: false }), isAdmin, orderController.deleteOrder);

router.post('/create-repeat-order', passport.authenticate('jwt', { session: false }), isOperatorOrAdmin, orderController.createRepeatOrder);

// get orders for logged in disinfector
router.post('/get-my-orders', passport.authenticate('jwt', { session: false }), isDisinfector, orderController.getOrders);

// add disinfector comment to order
router.post('/addDisinfectorComment', passport.authenticate('jwt', { session: false }), isDisinfector, orderController.addDisinfectorComment);

// get order by id to fill out order completion form
router.post('/get-order-by-id', passport.authenticate('jwt', { session: false }), orderController.getOrderById);

router.post('/search-orders', passport.authenticate('jwt', { session: false }), orderController.searchOrders);

// order completion form is submitted
router.post('/submit-complete-order', passport.authenticate('jwt', { session: false }), isDisinfector, orderController.submitCompleteOrder);

router.post('/get-complete-order-in-month', passport.authenticate('jwt', { session: false }), isDisinfector, orderController.getCompleteOrdersInMonth)

// get events when materials were added to disinfector
router.post('/get-add-material-events', passport.authenticate('jwt', { session: false }), isDisinfector, orderController.getAddMaterialsEvents);

module.exports = router;