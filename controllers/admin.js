const mongoose = require('mongoose');
const User = require('../models/user');
const Chat = require('../models/chat');
const Anons = require('../models/anons');
const Order = require('../models/order');
const AddMaterial = require('../models/addMaterial');
const io = require('../socket');


exports.getOrderQueriesForAdmin = (req, res) => {
  Order.find({
    completed: true,
    adminDecided: false
  })
    .populate('disinfectorId userCreated')
    .exec()
    .then(orderQueries => res.json(orderQueries))
    .catch(err => {
      console.log('getOrderQueriesForAdmin ERROR', err);
      return res.status(400).json(err);
    });
};


exports.confirmOrderQuery = (req, res) => {
  Order.findById(req.body.object.orderId)
    .then(order => {
      order.adminDecided = true;
      order.adminConfirmed = req.body.object.response;
      order.adminCheckedAt = new Date();
      return order.save();
    })
    .then(savedOrder => res.json(savedOrder))
    .catch(err => {
      console.log('confirmOrderQuery ERROR', err);
      return res.status(404).json(err);
    });
};


exports.getDisinfectors = (req, res) => {
  User.find({ occupation: 'disinfector' })
    .then(disinfectors => res.json(disinfectors))
    .catch(err => {
      console.log('getDisinfectors ERROR', err);
      return res.status(404).json(err);
    });
};


exports.addMaterialToDisinfector = (req, res) => {
  User.findById(req.body.object.disinfector)
    .then(user => {
      req.body.object.materials.forEach(mat => {
        user.materials.forEach(item => {
          if (item.material === mat.material) {
            item.amount += Number(mat.amount);
            return;
          }
        });
      });
      user.save();
    });

  const newObject = new AddMaterial({
    disinfector: req.body.object.disinfector,
    admin: req.body.object.admin,
    materials: req.body.object.materials,
    createdAt: new Date()
  });

  newObject.save()
    .then(obj => res.json(obj))
    .catch(err => {
      console.log('addMaterialToDisinfector ERROR', err);
      return res.status(400).json(err);
    });
};


exports.addMatEventsMonth = (req, res) => {
  const month = Number(req.body.month);
  const year = Number(req.body.year);

  AddMaterial.find()
    .populate('disinfector admin')
    .exec()
    .then(events => {
      events = events.filter(item =>
        new Date(item.createdAt).getMonth() === month &&
        new Date(item.createdAt).getFullYear() === year
      );
      return res.json(events);
    })
    .catch(err => {
      console.log('addMatEventsMonth ERROR', err);
      res.status(404).json(err);
    });
};


exports.addMatEventsWeek = (req, res) => {
  const days = req.body.days;

  AddMaterial.find()
    .populate('disinfector admin')
    .exec()
    .then(events => {
      events = events.filter(item =>
        new Date(item.createdAt) >= new Date(days[0]) &&
        new Date(item.createdAt).setHours(0, 0, 0, 0) <= new Date(days[6])
      );
      return res.json(events);
    })
    .catch(err => {
      console.log('addMatEventsWeek ERROR', err);
      res.status(404).json(err);
    });
};