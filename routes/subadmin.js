const express = require('express');
const passport = require('passport');
const router = express.Router();

const isAdmin = require('../middleware/isAdmin');
const isSubadmin = require('../middleware/isSubadmin');
const isAdminOrSubadmin = require('../middleware/isAdminOrSubadmin');

const subadminController = require('../controllers/subadmin');

router.post('/get-sorted-orders', passport.authenticate('jwt', { session: false }), isAdminOrSubadmin, subadminController.getSortedOrders);

router.post('/get-all-disinfectors', passport.authenticate('jwt', { session: false }), isAdminOrSubadmin, subadminController.getAllDisinfectors);

router.post('/get-subadmin-materials', passport.authenticate('jwt', { session: false }), isAdminOrSubadmin, subadminController.getSubadminMaterials);

// subadmin adds material to disinfector
router.post('/add-material-to-disinfector', passport.authenticate('jwt', { session: false }), isAdminOrSubadmin, subadminController.addMaterialToDisinfector);

module.exports = router;