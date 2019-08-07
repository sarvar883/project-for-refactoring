const mongoose = require('mongoose');
const User = require('../models/user');
const Chat = require('../models/chat');
const Anons = require('../models/anons');
const Order = require('../models/order');
const CompleteOrder = require('../models/completeOrder');
const ConfirmedOrder = require('../models/confirmedOrder');
const io = require('../socket');

const validateConfirmedOrder = require('../validation/confirmOrder');

exports.getSortedOrders = (req, res) => {
  const date = new Date(req.body.date);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  Order.find()
    .populate('disinfectorId')
    .exec()
    .then(orders => {
      let sortedOrders = orders.filter(item => item.dateFrom.getDate() === day && item.dateFrom.getMonth() === month && item.dateFrom.getFullYear() === year);
      // sortedOrders.sort(function (a, b) {
      //   return a.dateFrom.getTime() - b.dateFrom.getTime();
      // });
      res.json(sortedOrders);
    })
    .catch(err => {
      console.log('getSortedOrders ERROR', err);
      return res.status(400).json(err);
    });
};


exports.getCompleteOrders = (req, res) => {
  CompleteOrder.find({ confirmed: false })
    .populate('orderId disinfectorId')
    .exec()
    .then(completeOrders => res.json(completeOrders))
    .catch(err => {
      console.log('getCompleteOrders ERROR', err);
      return res.status(400).json(err);
    });
};


exports.getCompleteOrderById = (req, res) => {
  CompleteOrder.findById(req.params.id)
    .populate('orderId disinfectorId')
    .exec()
    .then(order => res.json(order))
    .catch(err => {
      console.log('getCompleteOrderById ERROR', err);
      return res.status(404).json(err);
    });
};


exports.confirmCompleteOrder = (req, res) => {
  const { errors, isValid } = validateConfirmedOrder(req.body.object);

  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  CompleteOrder
    .findById(req.body.object.completeOrderId)
    .then(foundOrder => {
      foundOrder.confirmed = true;
      foundOrder.save();
    });

  const newObject = new ConfirmedOrder({
    completeOrderId: req.body.object.completeOrderId,
    disinfectorId: req.body.object.disinfectorId,
    clientReview: req.body.object.clientReview,
    score: req.body.object.score,
    orderDate: req.body.object.orderDate
  });

  newObject.save()
    .then(savedObject => res.json(savedObject))
    .catch(err => {
      console.log('confirmCompleteOrder ERROR', err);
      return res.status(400).json(err);
    });
};