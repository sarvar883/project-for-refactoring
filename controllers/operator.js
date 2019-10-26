const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/order');
const io = require('../socket');

const validateConfirmedOrder = require('../validation/confirmOrder');

exports.getSortedOrders = (req, res) => {
  const date = new Date(req.body.date);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  Order.find()
    .populate('disinfectorId userCreated')
    .exec()
    .then(orders => {
      let sortedOrders = orders.filter(item =>
        new Date(item.dateFrom).getDate() === day &&
        new Date(item.dateFrom).getMonth() === month &&
        new Date(item.dateFrom).getFullYear() === year
      );
      return res.json(sortedOrders);
    })
    .catch(err => {
      console.log('getSortedOrders ERROR', err);
      return res.status(400).json(err);
    });
};


exports.getCompleteOrders = (req, res) => {
  const operatorId = req.body.id;

  Order.find({
    userCreated: operatorId,
    completed: true,
    operatorDecided: false
  })
    .populate('disinfectorId userCreated')
    .exec()
    .then(completeOrders => res.json(completeOrders))
    .catch(err => {
      console.log('getCompleteOrders ERROR', err);
      return res.status(400).json(err);
    });
};


exports.getCompleteOrderById = (req, res) => {
  Order.findById(req.params.id)
    .populate('disinfectorId')
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

  Order
    .findById(req.body.object.orderId)
    .then(foundOrder => {
      foundOrder.operatorDecided = true;
      foundOrder.operatorConfirmed = true;
      foundOrder.clientReview = req.body.object.clientReview;
      foundOrder.score = req.body.object.score;
      foundOrder.operatorCheckedAt = req.body.object.operatorCheckedAt;
      return foundOrder.save();
    })
    .then(confirmedOrder => res.json(confirmedOrder))
    .catch(err => {
      console.log('confirmCompleteOrder ERROR', err);
      return res.status(400).json(err);
    });
};


exports.getRepeatOrders = (req, res) => {
  Order.find({ repeatedOrder: true, userCreated: req.body.operatorId, repeatedOrderDecided: false })
    .populate('previousOrder disinfectorId')
    .exec()
    .then(orders => {
      orders = orders.sort((a, b) => new Date(a.timeOfRepeat) - new Date(b.timeOfRepeat));
      return res.json(orders);
    })
    .catch(err => {
      console.log('getRepeatOrders ERROR', err);
      return res.status(400).json(err);
    });
};


exports.repeatOrderForm = (req, res) => {
  Order.findById(req.body.id)
    .populate('disinfectorId previousOrder userCreated')
    .exec()
    .then(order => res.json(order))
    .catch(err => {
      console.log('repeatOrderForm ERROR', err);
      return res.status(400).json(err);
    });
};


exports.repeatOrderNotNeeded = (req, res) => {
  Order.findById(req.body.id)
    .then(order => {
      order.repeatedOrderDecided = true;
      order.repeatedOrderNeeded = false;
      return order.save();
    })
    .then(savedOrder => res.json(savedOrder))
    .catch(err => {
      console.log('repeatOrderNotNeeded ERROR', err);
      return res.status(400).json(err);
    });
};