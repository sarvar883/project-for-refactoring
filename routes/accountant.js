const express = require('express');
const passport = require('passport');
const router = express.Router();

const accountantController = require('../controllers/accountant');
const isAccountant = require('../middleware/isAccountant');

router.post('/get-queries', passport.authenticate('jwt', { session: false }), isAccountant, accountantController.getQueries);

router.post('/get-query-by-id', passport.authenticate('jwt', { session: false }), isAccountant, accountantController.getQueryById);

router.post('/confirm-query', passport.authenticate('jwt', { session: false }), isAccountant, accountantController.confirmQuery);

module.exports = router;