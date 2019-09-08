const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/order');
const io = require('../socket');


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
      console.log('getSortedOrders SUBADMIN ERROR', err);
      return res.status(400).json(err);
    });
};