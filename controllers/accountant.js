const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/order');
const Client = require('../models/client');
const AddMaterial = require('../models/addMaterial');
const ComingMaterial = require('../models/comingMaterial');
const io = require('../socket');


exports.getQueries = (req, res) => {
  Order.find({
    completed: true,
    clientType: 'corporate',
    accountantDecided: false
  })
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .exec()
    .then(orders => res.json(orders))
    .catch(err => {
      console.log('Accountant getQueries ERROR', err);
      res.status(400).json(err);
    });
};


exports.getQueryById = (req, res) => {
  Order.findById(req.body.id)
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .exec()
    .then(order => res.json(order))
    .catch(err => {
      console.log('Accountant getQueryById ERROR', err);
      res.status(400).json(err);
    });
};


exports.confirmQuery = (req, res) => {
  Order.findById(req.body.object.orderId)
    .then(order => {
      order.accountantDecided = true;
      if (req.body.object.decision === 'confirm') {
        order.accountantConfirmed = true;
        order.invoice = req.body.object.invoice;
        order.cost = req.body.object.cost;
      } else if (req.body.object.decision === 'reject') {
        order.accountantConfirmed = false;
      }
      order.accountantCheckedAt = new Date();
      return order.save();
    })
    .then(savedOrder => res.json(savedOrder))
    .catch(err => {
      console.log('Accountant confirmQuery ERROR', err);
      res.status(400).json(err);
    });
};