const express = require('express');
const passport = require('passport');
const router = express.Router();

const adminController = require('../controllers/admin');
const isAdmin = require('../middleware/isAdmin');

router.post('/get-order-queries-for-admin', passport.authenticate('jwt', { session: false }), isAdmin, adminController.getOrderQueriesForAdmin);

router.post('/admin-confirms-order-query', passport.authenticate('jwt', { session: false }), isAdmin, adminController.confirmOrderQuery);

router.post('/get-all-disinfectors', passport.authenticate('jwt', { session: false }), isAdmin, adminController.getDisinfectors);

router.post('/add-materials-to-disinfector', passport.authenticate('jwt', { session: false }), isAdmin, adminController.addMaterialToDisinfector);

router.post('/get-add-material-events-month', passport.authenticate('jwt', { session: false }), isAdmin, adminController.addMatEventsMonth);

router.post('/get-add-material-events-week', passport.authenticate('jwt', { session: false }), isAdmin, adminController.addMatEventsWeek);

module.exports = router;