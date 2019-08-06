const mongoose = require('mongoose');
const User = require('../models/user');
const Chat = require('../models/chat');
const Anons = require('../models/anons');
const Order = require('../models/order');
const CompleteOrder = require('../models/completeOrder');
const ConfirmedOrder = require('../models/confirmedOrder');
const io = require('../socket');


exports.statsForOperator = async (req, res) => {
  const month = Number(req.body.month);
  const year = Number(req.body.year);

  let orders = await Order.find().populate('disinfectorId').exec();
  orders = orders.filter(order => new Date(order.dateFrom).getMonth() === month && new Date(order.dateFrom).getFullYear() === year);

  let completeOrders = await CompleteOrder.find({ confirmed: true }).populate('orderId disinfectorId').exec();
  completeOrders = completeOrders.filter(item => new Date(item.orderId.dateFrom).getMonth() === month && new Date(item.orderId.dateFrom).getFullYear() === year);

  return res.json({
    orders: orders,
    completeOrders: completeOrders
  });
};