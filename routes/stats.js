const express = require('express');
const passport = require('passport');
const router = express.Router();

const statsController = require('../controllers/stats');
const isDisinfector = require('../middleware/isDisinfector');
const isOperatorOrAdmin = require('../middleware/isOperatorOrAdmin');
const isAdmin = require('../middleware/isAdmin');

// stats for disinfector
router.post('/for-disinfector-month', passport.authenticate('jwt', { session: false }), statsController.monthStatsForDisinfector);

router.post('/for-disinfector-week', passport.authenticate('jwt', { session: false }), statsController.weekStatsForDisinfector);

router.post('/for-disinfector-day', passport.authenticate('jwt', { session: false }), statsController.dayStatsForDisinfector);

router.post('/for-admin-month', passport.authenticate('jwt', { session: false }), isAdmin, statsController.monthStatsForAdmin);

router.post('/for-admin-week', passport.authenticate('jwt', { session: false }), isAdmin, statsController.weekStatsForAdmin);

router.post('/for-admin-day', passport.authenticate('jwt', { session: false }), isAdmin, statsController.dayStatsForAdmin);

router.post('/for-admin-disinf-stats-month', passport.authenticate('jwt', { session: false }), isAdmin, statsController.disinfMonthStatsForAdmin);

router.post('/for-admin-disinf-stats-week', passport.authenticate('jwt', { session: false }), isAdmin, statsController.disinfWeekStatsForAdmin);

router.post('/for-admin-disinf-stats-day', passport.authenticate('jwt', { session: false }), isAdmin, statsController.disinfDayStatsForAdmin);

router.post('/adv-stats', passport.authenticate('jwt', { session: false }), isAdmin, statsController.getAdvStats);

router.post('/operator-stats', passport.authenticate('jwt', { session: false }), isAdmin, statsController.getOperatorStats);

router.post('/get-user-mat-coming', passport.authenticate('jwt', { session: false }), statsController.getUserMatComing);

module.exports = router;