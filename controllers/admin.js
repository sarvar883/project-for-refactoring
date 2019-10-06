const mongoose = require('mongoose');
const User = require('../models/user');
const Chat = require('../models/chat');
const Anons = require('../models/anons');
const Order = require('../models/order');
const Client = require('../models/client');
const AddMaterial = require('../models/addMaterial');
const ComingMaterial = require('../models/comingMaterial');
const CurrentMaterial = require('../models/currentMaterial');
const stringSimilarity = require('string-similarity');
const io = require('../socket');

const materials = require('../client/src/components/common/materials');


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
      console.log('getSortedOrders ADMIN ERROR', err);
      return res.status(400).json(err);
    });
};


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


exports.getOperators = (req, res) => {
  User.find({ occupation: 'operator' })
    .then(operators => res.json(operators))
    .catch(err => {
      console.log('getOperators ERROR', err);
      return res.status(404).json(err);
    });
};


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

  CurrentMaterial.findOne()
    .then(currentMaterials => {
      currentMaterials.materials.forEach(item => {
        req.body.object.materials.forEach(element => {
          if (item.material === element.material && item.unit === element.unit) {
            item.amount -= element.amount;
            return;
          }
        });
      });
      currentMaterials.save();
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


exports.getCurMat = (req, res) => {
  // let emptyArray = [];
  // materials.forEach(item => {
  //   emptyArray.push({
  //     material: item.material,
  //     amount: 0,
  //     unit: 'гр'
  //   });
  // });

  // const cur = new CurrentMaterial({
  //   materials: emptyArray,
  //   lastUpdated: new Date()
  // });
  // cur.save();

  CurrentMaterial.findOne()
    .then(curMat => res.json(curMat))
    .catch(err => {
      console.log('getCurMat ERROR', err);
      res.status(404).json(err);
    });
};


exports.addMatComing = (req, res) => {
  const { object } = req.body;

  const newObject = new ComingMaterial({
    admin: object.admin,
    materials: object.materials,
    createdAt: new Date()
  });

  newObject.save();

  CurrentMaterial.findOne()
    .then(curMat => {
      let array = curMat.materials;

      object.materials.forEach(item => {
        array.forEach(element => {
          if (item.material === element.material && item.unit === element.unit) {
            element.amount += item.amount;
            return;
          }
        });
      });
      curMat.materials = array;
      curMat.lastUpdated = new Date();
      curMat.save();
      return res.json(curMat);
    })
    .catch(err => {
      console.log('addMatComing ERROR', err);
      res.status(400).json(err);
    });
};


exports.matComingMonth = (req, res) => {
  const month = Number(req.body.month);
  const year = Number(req.body.year);

  ComingMaterial.find()
    .populate('admin')
    .exec()
    .then(comings => {
      comings = comings.filter(item =>
        new Date(item.createdAt).getMonth() === month &&
        new Date(item.createdAt).getFullYear() === year
      );
      return res.json(comings);
    })
    .catch(err => {
      console.log('matComingMonth ERROR', err);
      res.status(404).json(err);
    });
};


exports.matComingWeek = (req, res) => {
  const days = req.body.days;

  ComingMaterial.find()
    .populate('admin')
    .exec()
    .then(comings => {
      comings = comings.filter(item =>
        new Date(item.createdAt) >= new Date(days[0]) &&
        new Date(item.createdAt).setHours(0, 0, 0, 0) <= new Date(days[6])
      );
      return res.json(comings);
    })
    .catch(err => {
      console.log('matComingWeek ERROR', err);
      res.status(404).json(err);
    });
};


exports.searchClients = (req, res) => {
  Client.find()
    .populate('orders')
    .exec()
    .then(clients => {
      if (req.body.object.method === 'name') {
        clients = clients.filter(item => stringSimilarity.compareTwoStrings(item.name.toUpperCase(), req.body.object.payload.toUpperCase()) > 0.55);
      } else if (req.body.object.method === 'phone') {
        clients = clients.filter(item => stringSimilarity.compareTwoStrings(item.phone.toUpperCase(), req.body.object.payload.toUpperCase()) > 0.80);
      } else if (req.body.object.method === 'address') {
        clients = clients.filter(item => stringSimilarity.compareTwoStrings(item.address.toUpperCase(), req.body.object.payload.toUpperCase()) > 0.55);
      }
      return res.json(clients);
    })
    .catch(err => {
      console.log('searchClients ERROR', err);
      res.status(404).json(err);
    });
};