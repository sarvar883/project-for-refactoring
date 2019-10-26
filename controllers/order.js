const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/order');
const Client = require('../models/client');
const AddMaterial = require('../models/addMaterial');

const stringSimilarity = require('string-similarity');
const validateOrderInput = require('../validation/order');
const io = require('../socket');


// get disinfectors and subadmins
exports.getAllDisinfectors = (req, res) => {
  User.find()
    .or([{ occupation: 'disinfector' }, { occupation: 'subadmin' }])
    .then(users => res.json(users))
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
    phone2: req.body.phone2,
    typeOfService: req.body.typeOfService,
    advertising: req.body.advertising,
    comment: req.body.comment,
    disinfectorComment: '',
    userCreated: req.body.userCreated,
    repeatedOrder: false
  });

  order.save()
    .then((savedOrder) => {

      Client.findOne({ phone: req.body.phone })
        .then(client => {
          if (client) {
            // if we have a client with this phone number
            client.orders.push(savedOrder._id);
            client.save();
          } else {
            let array = [];
            array.push(savedOrder._id);

            const newClient = new Client({
              _id: mongoose.Types.ObjectId(),
              name: req.body.client,
              phone: req.body.phone,
              address: req.body.address,
              orders: array,
              createdAt: new Date()
            });
            newClient.save();
          }
        });


      Order.findOne(order)
        .populate('disinfectorId userCreated')
        .exec()
        .then(savedOrder => {
          io.getIO().emit('createOrder', {
            disinfectorId: req.body.disinfectorId,
            order: savedOrder
          });
          return res.json(savedOrder);
        });
    })
    .catch(err => {
      console.log('createOrder ERROR', err);
      res.status(400).json(err);
    });
};


exports.editOrder = (req, res) => {
  const { order } = req.body;
  Order.findById(order._id)
    .then(orderForEdit => {
      orderForEdit.disinfectorId = order.disinfectorId;
      orderForEdit.client = order.client;
      orderForEdit.address = order.address;
      orderForEdit.dateFrom = order.dateFrom;
      orderForEdit.phone = order.phone;
      orderForEdit.phone2 = order.phone2;
      orderForEdit.typeOfService = order.typeOfService;
      orderForEdit.advertising = order.advertising;
      orderForEdit.comment = order.comment;

      orderForEdit.save()
        .then(editedOrder => {
          editedOrder.populate('disinfectorId')
            .execPopulate()
            .then(item => {
              io.getIO().emit('editOrder', {
                order: item
              });
              return res.json(editedOrder);
            });
        });
    })
    .catch(err => {
      console.log('editOrder ERROR', err);
      res.status(404).json(err);
    });
};


exports.deleteOrder = (req, res) => {
  Order.findByIdAndRemove(req.body.id)
    .then(result => {
      io.getIO().emit('deleteOrder', {
        id: req.body.id,
        orderDateFrom: req.body.orderDateFrom
      });
      Client.findOne({ phone: req.body.clientPhone })
        .then(client => {
          client.orders = client.orders.filter(item => item.toString() !== req.body.id);
          return client.save();
        });
    })
    .catch(err => {
      console.log('deleteOrder ERROR', err);
      res.status(404).json(err);
    });
};


exports.createRepeatOrder = (req, res) => {
  const { errors, isValid } = validateOrderInput(req.body.order);

  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  Order.findById(req.body.order.id)
    .then(order => {
      order.disinfectorId = req.body.order.disinfectorId;
      order.client = req.body.order.client;
      order.address = req.body.order.address;
      order.dateFrom = req.body.order.dateFrom;
      order.phone = req.body.order.phone;
      order.phone2 = req.body.order.phone2;
      order.typeOfService = req.body.order.typeOfService;
      order.advertising = req.body.order.advertising;
      order.comment = req.body.order.comment;
      order.phone = req.body.order.phone;
      order.repeatedOrderDecided = true;
      order.repeatedOrderNeeded = true;

      order.save()
        .then((savedOrder) => {
          Client.findOne({ phone: req.body.order.phone })
            .then(client => {
              if (client) {
                // if we have a client with this phone number
                client.orders.push(savedOrder._id);
                client.save();
              } else {
                let array = [];
                array.push(savedOrder._id);

                const newClient = new Client({
                  _id: mongoose.Types.ObjectId(),
                  name: req.body.order.client,
                  phone: req.body.order.phone,
                  address: req.body.order.address,
                  orders: array,
                  createdAt: new Date()
                });
                newClient.save();
              }
            });

          Order.findOne(order)
            .populate('disinfectorId userCreated')
            .exec()
            .then(savedOrder => {
              io.getIO().emit('createOrder', {
                disinfectorId: req.body.disinfectorId,
                order: savedOrder
              });
              return res.json(savedOrder);
            });
        })
    })
    .catch(err => {
      console.log('createRepeatOrder ERROR', err);
      res.status(404).json(err);
    });
};


// get orders for logged in disinfector (only not completed orders)
exports.getOrders = (req, res) => {
  Order.find({
    disinfectorId: req.body.userId
  })
    .populate('disinfectorId userCreated')
    .exec()
    .then(orders => {
      orders = orders.filter(item => (!item.repeatedOrder && !item.completed) || (!item.completed && item.repeatedOrder && item.repeatedOrderDecided && item.repeatedOrderNeeded));
      return res.json(orders);
    })
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


exports.searchOrders = (req, res) => {
  Order.find()
    .populate('disinfectorId userCreated')
    .exec()
    .then(orders => {
      if (req.body.object.method === 'address') {
        orders = orders.filter(item => stringSimilarity.compareTwoStrings(item.address.toUpperCase(), req.body.object.payload.toUpperCase()) > 0.55);
      } else if (req.body.object.method === 'phone') {
        orders = orders.filter(item => stringSimilarity.compareTwoStrings(item.phone.toUpperCase(), req.body.object.payload.toUpperCase()) > 0.80);
      }
      return res.json(orders);
    })
    .catch(err => {
      console.log('searchOrders ERROR', err);
      res.status(404).json(err);
    });
};


exports.submitCompleteOrder = (req, res) => {
  const { order } = req.body;

  User.findById(order.disinfectorId)
    .then(user => {
      user.subtractConsumptionMaterials(order.consumption)
    });

  Order.findById(order.orderId)
    .then(foundOrder => {
      foundOrder.completed = true;
      foundOrder.consumption = order.consumption;
      foundOrder.guarantee = order.guarantee;
      foundOrder.paymentMethod = order.paymentMethod;
      if (order.paymentMethod === 'Безналичный') {
        foundOrder.invoice = order.invoice;
      } else {
        foundOrder.invoice = -1;
      }
      foundOrder.cost = order.cost;
      foundOrder.completedAt = new Date();
      return foundOrder.save();
    })
    .then(newCompleteOrder => {
      let date = new Date(newCompleteOrder.dateFrom);

      const repeatOrder = new Order({
        disinfectorId: newCompleteOrder.disinfectorId,
        client: newCompleteOrder.client,
        address: newCompleteOrder.address,
        phone: newCompleteOrder.phone,
        typeOfService: newCompleteOrder.typeOfService,
        advertising: newCompleteOrder.advertising,
        userCreated: newCompleteOrder.userCreated,
        repeatedOrder: true,
        // add several months to date
        timeOfRepeat: new Date(date.setMonth(date.getMonth() + newCompleteOrder.guarantee)),
        previousOrder: newCompleteOrder._id
      });
      repeatOrder.save();

      io.getIO().emit('submitCompleteOrder', {
        completeOrder: newCompleteOrder
      });
      return res.json(newCompleteOrder);
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


exports.getAddMaterialsEvents = (req, res) => {
  const id = req.body.id;
  AddMaterial.find({ disinfector: id })
    .populate('disinfector admin')
    .exec()
    .then(events => res.json(events))
    .catch(err => {
      console.log('getAddMaterialsEvents ERROR', err);
      res.status(400).json(err);
    });
};