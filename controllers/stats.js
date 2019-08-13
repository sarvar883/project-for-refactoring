const mongoose = require('mongoose');
const User = require('../models/user');
const Chat = require('../models/chat');
const Anons = require('../models/anons');
const Order = require('../models/order');
const io = require('../socket');


exports.statsForDisinfector = async (req, res) => {
  const id = req.body.id;
  const month = Number(req.body.month);
  const year = Number(req.body.year);

  Order.find({ disinfectorId: id })
    .then(orders => {
      orders = orders.filter(order => new Date(order.dateFrom).getMonth() === month && new Date(order.dateFrom).getFullYear() === year);
      return res.json(orders);
    })
    .catch(err => {
      console.log('statsForDisinfector ERROR', err);
      res.status(404).json(err);
    });
};