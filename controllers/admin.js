const mongoose = require('mongoose');
const User = require('../models/user');
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

  // Order.find()
  //   .then(orders => {
  //     orders.forEach(order => {
  //       if (order.clientType === 'individual') {
  //         order.paymentMethod = 'cash';
  //       } else if (order.clientType === 'corporate') {
  //         order.paymentMethod = 'notCash';
  //       }
  //       order.save();
  //     });
  //   });


  Order.find()
    .populate('disinfectorId')
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
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .exec()
    .then(orderQueries => {
      orderQueries = orderQueries.filter(order => order.clientType === 'individual' || order.paymentMethod === 'cash');
      return res.json(orderQueries);
    })
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


exports.getDisinfectorsAndSubadmins = (req, res) => {
  User.find()
    .or([{ occupation: 'disinfector' }, { occupation: 'subadmin' }])
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


exports.getOperatorsAndAdmins = (req, res) => {
  User.find()
    .or([{ occupation: 'operator' }, { occupation: 'admin' }])
    .then(users => res.json(users))
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
  //     unit: item.unit
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


exports.addClient = (req, res) => {
  // const { errors, isValid } = validateAddClient(req.body.object);
  // // Check Validation
  // if (!isValid) {
  //   // Return any errors with 400 status
  //   return res.status(400).json(errors);
  // }

  let errors = {};

  if (req.body.object.type === 'corporate') {
    // case insensitive search
    Client.findOne({ name: new RegExp(`^${req.body.object.name}$`, 'i') })
      .then(client => {
        if (client) {
          errors.name = 'Корпоративный Клиент с таким именем уже существует';
          return res.status(400).json(errors);
        } else {
          const newClient = new Client({
            _id: mongoose.Types.ObjectId(),
            type: req.body.object.type,
            name: req.body.object.name,
            orders: [],
            createdAt: req.body.object.createdAt
          });
          return newClient.save();
        }
      })
      .then(savedClient => res.json(savedClient))
      .catch(err => {
        console.log('addClient ERROR', err);
        res.status(400).json(err);
      });

  } else if (req.body.object.type === 'individual') {
    Client.findOne({ phone: req.body.object.phone })
      .then(client => {
        if (client) {
          errors.phone = 'Физический Клиент с таким номером уже существует';
          return res.status(400).json(errors);
        } else {
          const newClient = new Client({
            _id: mongoose.Types.ObjectId(),
            type: req.body.object.type,
            name: req.body.object.name,
            phone: req.body.object.phone,
            address: req.body.object.address,
            orders: [],
            createdAt: req.body.object.createdAt
          });
          return newClient.save();
        }
      })
      .then(savedClient => res.json(savedClient))
      .catch(err => {
        console.log('addClient ERROR', err);
        res.status(400).json(err);
      });
  }
};


exports.searchClients = (req, res) => {
  Client.find()
    // .populate({
    //   path: 'orders',
    //   model: 'Order',
    //   populate: {
    //     path: 'disinfectorId userCreated userAcceptedOrder disinfectors.user',
    //     model: 'User'
    //   }
    // })
    // .exec()
    .then(clients => {

      clients = clients.filter(item => {
        if (req.body.object.method === 'name') {
          return stringSimilarity.compareTwoStrings(item.name.toUpperCase(), req.body.object.payload.toUpperCase()) > 0.45;
        } else if (req.body.object.method === 'phone') {
          if (item.type === 'corporate') {
            return false;
          } else if (item.type === 'individual') {
            return stringSimilarity.compareTwoStrings(item.phone, req.body.object.payload) > 0.5;
          }
        } else if (req.body.object.method === 'address') {
          if (item.type === 'corporate') {
            return false;
          } else if (item.type === 'individual') {
            return stringSimilarity.compareTwoStrings(item.address.toUpperCase(), req.body.object.payload.toUpperCase()) > 0.45;
          }
        } else if (req.body.object.method === 'all') {
          return true;
        }
      });

      return res.json(clients);
    })
    .catch(err => {
      console.log('searchClients ERROR', err);
      res.status(404).json(err);
    });
};


exports.clientById = (req, res) => {
  Client.findById(req.body.id)
    .populate({
      path: 'orders',
      model: 'Order',
      populate: {
        path: 'disinfectorId userCreated userAcceptedOrder disinfectors.user',
        model: 'User'
      }
    })
    .exec()
    .then(client => res.json(client))
    .catch(err => {
      console.log('clientById ERROR', err);
      res.status(404).json(err);
    });
};