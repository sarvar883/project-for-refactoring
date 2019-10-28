const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/order');
const Client = require('../models/client');
const AddMaterial = require('../models/addMaterial');
const ComingMaterial = require('../models/comingMaterial');
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


exports.getAllDisinfectors = (req, res) => {
  User.find({ occupation: 'disinfector' })
    .then(disinfectors => res.json(disinfectors))
    .catch(err => {
      console.log('getAllDisinfectors SUBADMIN ERROR', err);
      return res.status(400).json(err);
    });
};


exports.getSubadminMaterials = (req, res) => {
  User.findById(req.body.id)
    .then(user => res.json(user))
    .catch(err => {
      console.log('getSubadminMaterials ERROR', err);
      return res.status(400).json(err);
    });
};


// subadmin adds material to disinfector
exports.addMaterialToDisinfector = (req, res) => {
  User.findById(req.body.object.disinfector)
    .then(user => {
      req.body.object.materials.forEach(mat => {
        user.materials.forEach(item => {
          if (item.material === mat.material && item.unit === mat.unit) {
            item.amount += Number(mat.amount);
            return;
          }
        });
      });
      user.save();
    });

  User.findById(req.body.object.subadmin)
    .then(subadmin => {
      subadmin.materials.forEach(item => {
        req.body.object.materials.forEach(mat => {
          if (item.material === mat.material && item.unit === mat.unit) {
            item.amount -= mat.amount;
            return;
          }
        });
      });
      subadmin.save();
    });

  const newObject = new AddMaterial({
    disinfector: req.body.object.disinfector,
    admin: req.body.object.subadmin,
    materials: req.body.object.materials,
    createdAt: new Date()
  });

  newObject.save()
    .then(obj => res.json(obj))
    .catch(err => {
      console.log('addMaterialToDisinfector SUBADMIN ERROR', err);
      return res.status(400).json(err);
    });
};