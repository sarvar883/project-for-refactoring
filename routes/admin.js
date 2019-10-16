const express = require('express');
const passport = require('passport');
const router = express.Router();

const adminController = require('../controllers/admin');
const isAdmin = require('../middleware/isAdmin');

router.post('/get-sorted-orders', passport.authenticate('jwt', { session: false }), isAdmin, adminController.getSortedOrders);

router.post('/get-order-queries-for-admin', passport.authenticate('jwt', { session: false }), isAdmin, adminController.getOrderQueriesForAdmin);

router.post('/admin-confirms-order-query', passport.authenticate('jwt', { session: false }), isAdmin, adminController.confirmOrderQuery);

router.post('/get-all-disinfectors', passport.authenticate('jwt', { session: false }), isAdmin, adminController.getDisinfectors);

router.post('/get-all-operators', passport.authenticate('jwt', { session: false }), isAdmin, adminController.getOperators);

router.post('/add-materials-to-disinfector', passport.authenticate('jwt', { session: false }), isAdmin, adminController.addMaterialToDisinfector);

router.post('/get-add-material-events-month', passport.authenticate('jwt', { session: false }), isAdmin, adminController.addMatEventsMonth);

router.post('/get-add-material-events-week', passport.authenticate('jwt', { session: false }), isAdmin, adminController.addMatEventsWeek);

router.post('/get-current-materials', passport.authenticate('jwt', { session: false }), isAdmin, adminController.getCurMat);

router.post('/add-mat-coming', passport.authenticate('jwt', { session: false }), isAdmin, adminController.addMatComing);

router.post('/get-mat-coming-month', passport.authenticate('jwt', { session: false }), isAdmin, adminController.matComingMonth);

router.post('/get-mat-coming-week', passport.authenticate('jwt', { session: false }), isAdmin, adminController.matComingWeek);

router.post('/add-client', passport.authenticate('jwt', { session: false }), isAdmin, adminController.addClient);

router.post('/search-clients', passport.authenticate('jwt', { session: false }), isAdmin, adminController.searchClients);

module.exports = router;