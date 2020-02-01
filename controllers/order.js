const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/order');
const Client = require('../models/client');
const AddMaterial = require('../models/addMaterial');

const stringSimilarity = require('string-similarity');
const validateOrderInput = require('../validation/order');
const io = require('../socket');


// get all corporate clients
exports.getCorporateClients = (req, res) => {
  Client.find({ type: 'corporate' })
    .then(clients => res.json(clients))
    .catch(err => {
      console.log('getCorporateClients ERROR', err);
      res.status(404).json(err);
    });
};


exports.getAllUsers = (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => console.log('getAllUsers ERROR', err));
};


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

  let orderObject = {
    _id: mongoose.Types.ObjectId(),
    disinfectorId: req.body.disinfectorId,
    clientType: req.body.clientType,
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
    userAcceptedOrder: req.body.userAcceptedOrder,
    repeatedOrder: false
  };
  if (req.body.clientType === 'corporate') {
    orderObject.clientId = req.body.clientId;
  }

  const order = new Order(orderObject);
  order.save()
    .then((savedOrder) => {
      if (req.body.clientType === 'corporate') {
        Client.findById(req.body.clientId)
          .then(client => {
            client.orders.push(savedOrder._id);
            client.save();
          });

      } else if (req.body.clientType === 'individual') {
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
                type: req.body.clientType,
                name: req.body.client,
                phone: req.body.phone,
                address: req.body.address,
                orders: array,
                createdAt: new Date()
              });
              newClient.save();
            }
          });
      }

      Order.findOne(order)
        .populate('disinfectorId userCreated userAcceptedOrder clientId')
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
      orderForEdit.userAcceptedOrder = order.userAcceptedOrder;
      orderForEdit.clientType = order.clientType;
      orderForEdit.client = order.client;
      if (orderForEdit.clientType === 'corporate') {
        orderForEdit.clientId = order.clientId;
      }

      orderForEdit.address = order.address;
      orderForEdit.dateFrom = order.dateFrom;
      orderForEdit.phone = order.phone;
      orderForEdit.phone2 = order.phone2;
      orderForEdit.typeOfService = order.typeOfService;
      orderForEdit.advertising = order.advertising;
      orderForEdit.comment = order.comment;

      return orderForEdit.save()
    })
    .then(editedOrder => {
      editedOrder.populate('disinfectorId userCreated userAcceptedOrder clientId')
        .execPopulate()
        .then(item => {
          io.getIO().emit('editOrder', {
            order: item
          });
          // console.log('editedOrder', item);
          // return res.json(editedOrder);
          return res.json(item);
        });
    })
    .catch(err => {
      console.log('editOrder ERROR', err);
      res.status(404).json(err);
    });
};


exports.deleteOrder = (req, res) => {
  Order.findByIdAndRemove(req.body.object.id)
    .then(result => {
      io.getIO().emit('deleteOrder', {
        id: req.body.object.id,
        orderDateFrom: req.body.object.orderDateFrom
      });

      if (req.body.object.clientType === 'corporate') {
        Client.findById(req.body.object.clientId)
          .then(client => {
            client.orders = client.orders.filter(item => item.toString() !== req.body.object.id);
            return client.save();
          });
      } else if (req.body.object.clientType === 'individual') {
        Client.findOne({ phone: req.body.object.clientPhone })
          .then(client => {
            client.orders = client.orders.filter(item => item.toString() !== req.body.object.id);
            return client.save();
          });
      }
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
      order.clientType = req.body.order.clientType;
      order.client = req.body.order.client;
      order.address = req.body.order.address;
      order.dateFrom = req.body.order.dateFrom;
      order.phone = req.body.order.phone;
      order.phone2 = req.body.order.phone2;
      order.typeOfService = req.body.order.typeOfService;
      order.advertising = req.body.order.advertising;
      order.comment = req.body.order.comment;
      order.userAcceptedOrder = req.body.order.userAcceptedOrder;
      order.repeatedOrderDecided = true;
      order.repeatedOrderNeeded = true;

      if (req.body.order.clientType === 'corporate') {
        order.clientId = req.body.order.clientId;
      }

      order.save()
        .then((savedOrder) => {

          if (req.body.order.clientType === 'corporate') {
            Client.findById(req.body.order.clientId)
              .then(client => {
                client.orders.push(savedOrder._id);
                client.save();
              });

          } else if (req.body.order.clientType === 'individual') {
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
                    type: req.body.order.clientType,
                    name: req.body.order.client,
                    phone: req.body.order.phone,
                    address: req.body.order.address,
                    orders: array,
                    createdAt: new Date()
                  });
                  newClient.save();
                }
              });
          }

          Order.findOne(order)
            .populate('disinfectorId userCreated clientId userAcceptedOrder')
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
    .populate('disinfectorId userCreated clientId userAcceptedOrder')
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
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .exec()
    .then(order => res.json(order))
    .catch(err => {
      console.log('getOrderById ERROR', err);
      res.status(404).json(err);
    });
};


exports.searchOrders = (req, res) => {
  Order.find()
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .exec()
    .then(orders => {
      if (req.body.object.method === 'address') {
        orders = orders.filter(item => stringSimilarity.compareTwoStrings(item.address.toUpperCase(), req.body.object.payload.toUpperCase()) > 0.50);
      } else if (req.body.object.method === 'phone') {
        orders = orders.filter(item => stringSimilarity.compareTwoStrings(item.phone.toUpperCase(), req.body.object.payload.toUpperCase()) > 0.70);
      } else if (req.body.object.method === 'contract') {
        orders = orders.filter(item => {
          if (item.clientType === 'corporate' && item.contractNumber) {
            return stringSimilarity.compareTwoStrings(item.contractNumber.toUpperCase(), req.body.object.payload.toUpperCase()) > 0.70;
          } else {
            return false;
          }
        });
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

  order.disinfectors.forEach(item => {
    User.findById(item.disinfectorId)
      .then(user => {
        user.subtractConsumptionMaterials(item.consumption)
      });
  });

  Order.findById(order.orderId)
    .then(foundOrder => {
      foundOrder.completed = true;

      if (foundOrder.returnedBack && !foundOrder.returnHandled) {
        foundOrder.returnHandled = true;
        foundOrder.adminDecidedReturn = false;
      }

      let newArray = [];
      order.disinfectors.forEach(item => {
        newArray.push({
          user: item.disinfectorId,
          consumption: item.consumption
        });
      });

      foundOrder.disinfectors = newArray;
      foundOrder.guarantee = Number(order.guarantee);
      foundOrder.paymentMethod = order.paymentMethod;
      foundOrder.disinfectorComment = order.disinfectorComment;

      if (order.clientType === 'corporate') {
        if (order.paymentMethod === 'cash') {
          foundOrder.contractNumber = '';
          foundOrder.cost = Number(order.cost);
        } else if (order.paymentMethod === 'notCash') {
          foundOrder.contractNumber = order.contractNumber;
        }
      } else if (order.clientType === 'individual') {
        foundOrder.cost = Number(order.cost);
      }

      // if (order.paymentMethod === 'Безналичный') {
      //   foundOrder.invoice = order.invoice;
      // } else {
      //   foundOrder.invoice = -1;
      // }

      foundOrder.completedAt = new Date();
      return foundOrder.save();
    })
    .then(newCompleteOrder => {
      let date = new Date(newCompleteOrder.dateFrom);

      // if the query has been previously returned, it means that repeat order has already been created
      if (newCompleteOrder.returnedBack) {
        Order.findOne({ previousOrder: newCompleteOrder._id })
          .then(repOrder => {
            if (repOrder) {
              // add several months to date
              repOrder.timeOfRepeat = new Date(date.setMonth(date.getMonth() + newCompleteOrder.guarantee));
              repOrder.save();
            }
          });
      } else {
        const repeatOrder = new Order({
          disinfectorId: newCompleteOrder.disinfectorId,
          clientType: newCompleteOrder.clientType,
          client: newCompleteOrder.client,
          clientId: newCompleteOrder.clientId,
          address: newCompleteOrder.address,
          phone: newCompleteOrder.phone,
          phone2: newCompleteOrder.phone2,
          typeOfService: newCompleteOrder.typeOfService,
          advertising: newCompleteOrder.advertising,
          userCreated: newCompleteOrder.userCreated,
          userAcceptedOrder: newCompleteOrder.userAcceptedOrder,
          repeatedOrder: true,
          // add several months to date
          timeOfRepeat: new Date(date.setMonth(date.getMonth() + newCompleteOrder.guarantee)),
          previousOrder: newCompleteOrder._id
        });
        repeatOrder.save();
      }

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
    completed: true
  })
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .exec()
    .then(orders => {

      orders = orders.filter(item => {
        let amongDisinfectors = 0;
        item.disinfectors.forEach(element => {
          if (element.user._id.toString() === disinfectorId) amongDisinfectors++;
        });
        if (item.disinfectorId._id.toString() === disinfectorId || amongDisinfectors > 0) {
          return true;
        } else {
          return false;
        }
      });

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


exports.disAddMatToOtherDis = (req, res) => {
  // add material to recipient
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

  // subtract material from donor
  User.findById(req.body.object.admin)
    .then(user => {
      user.subtractConsumptionMaterials(req.body.object.materials);
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
      console.log('disAddMatToOtherDis ERROR', err);
      return res.status(400).json(err);
    });
};


exports.getReturnedQueries = (req, res) => {
  Order.find({
    disinfectorId: req.body.id,
    completed: true,
    returnedBack: true,
    returnHandled: false,
    adminDecided: false
  })
    .populate('clientId')
    .exec()
    .then(queries => res.json(queries))
    .catch(err => {
      console.log('getReturnedQueries ERROR', err);
      return res.status(400).json(err);
    });
};