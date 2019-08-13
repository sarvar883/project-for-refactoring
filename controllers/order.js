const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/order');

const validateOrderInput = require('../validation/order');
const validateDisinfectorCommentInput = require('../validation/disinfectorComment');
const validateCompleteOrder = require('../validation/completeOrder');
const io = require('../socket');


exports.getAllDisinfectors = (req, res) => {
  User.find({ occupation: 'disinfector' })
    .then(disinfectors => res.json(disinfectors))
    .catch(err => console.log('getAllDisinfectors ERROR', err));
};


exports.createOrder = (req, res) => {
  const { errors, isValid } = validateOrderInput(req.body);

  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    disinfectorId: req.body.disinfectorId,
    client: req.body.client,
    address: req.body.address,
    dateFrom: req.body.dateFrom,
    phone: req.body.phone,
    typeOfService: req.body.typeOfService,
    comment: req.body.comment,
    disinfectorComment: '',
    userCreated: req.body.userCreated
  });

  order.save()
    .then(() => {
      Order.findOne(order)
        .populate('disinfectorId userCreated')
        .exec()
        .then(savedOrder => {
          io.getIO().emit('createOrder', {
            disinfectorId: req.body.disinfectorId,
            order: savedOrder
          });
          return res.json(savedOrder);
        })
    })
    .catch(err => {
      console.log('createOrder ERROR', err);
      res.status(400).json(err);
    });
};


// get orders for logged in disinfector (only not completed orders)
exports.getOrders = (req, res) => {
  Order.find({
    disinfectorId: req.body.userId,
    completed: false
  })
    .populate('disinfectorId userCreated')
    .exec()
    .then(orders => res.json(orders))
    .catch(err => {
      console.log('getOrders ERROR', err);
      res.status(404).json(err);
    });
};


// add disinfector comment to order
exports.addDisinfectorComment = (req, res) => {
  Order.findById(req.body.id)
    .then(order => {
      order.disinfectorComment = req.body.comment;
      order.save();
      return res.json(order);
    })
    .catch(err => {
      console.log('getOrders ERROR', err);
      res.status(404).json(err);
    });
};


exports.getOrderById = (req, res) => {
  Order.findById(req.body.id)
    .populate('disinfectorId userCreated')
    .exec()
    .then(order => res.json(order))
    .catch(err => {
      console.log('getOrderById ERROR', err);
      res.status(404).json(err);
    });
};


exports.submitCompleteOrder = (req, res) => {
  const { order } = req.body;

  Order.findById(order.orderId)
    .then(foundOrder => {
      foundOrder.completed = true;
      foundOrder.consumption = order.consumption;
      foundOrder.paymentMethod = order.paymentMethod;
      foundOrder.cost = order.cost;
      foundOrder.completedAt = new Date();
      return foundOrder.save();
    })
    .then(newCompleteOrder => {
      io.getIO().emit('submitCompleteOrder', {
        completeOrder: newCompleteOrder
      });
      return res.json(newCompleteOrder)
    })
    .catch(err => {
      console.log('getOrderById ERROR', err);
      res.status(400).json(err);
    });
};


exports.getCompleteOrdersInMonth = (req, res) => {
  const month = Number(req.body.month);
  const year = Number(req.body.year);
  const disinfectorId = req.body.disinfectorId;

  Order.find({
    disinfectorId: disinfectorId,
    completed: true
  })
    .then(orders => {
      orders = orders.filter(item => new Date(item.createdAt).getMonth() === month && new Date(item.createdAt).getFullYear() === year);
      return res.json(orders);
    })
    .catch(err => {
      console.log('getCompleteOrdersInMonth ERROR', err);
      res.status(400).json(err);
    });
};