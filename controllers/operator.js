const mongoose = require('mongoose');
const User = require('../models/user');
const Chat = require('../models/chat');
const Anons = require('../models/anons');
const Order = require('../models/order');
const CompleteOrder = require('../models/completeOrder');
const io = require('../socket');


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
  CompleteOrder.find()
    .populate('orderId disinfectorId')
    .exec()
    .then(completeOrders => res.json(completeOrders))
    .catch(err => {
      console.log('getCompleteOrders ERROR', err);
      return res.status(400).json(err);
    });
};