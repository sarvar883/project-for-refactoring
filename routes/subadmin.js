const express = require('express');
const passport = require('passport');
const router = express.Router();

const isAdmin = require('../middleware/isAdmin');
const isSubadmin = require('../middleware/isSubadmin');
const isAdminOrSubadmin = require('../middleware/isAdminOrSubadmin');

const subadminController = require('../controllers/subadmin');

router.post('/get-sorted-orders', passport.authenticate('jwt', { session: false }), isAdminOrSubadmin, subadminController.getSortedOrders);

module.exports = router;