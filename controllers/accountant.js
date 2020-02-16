const Order = require('../models/order');
const User = require('../models/user');

exports.getQueries = (req, res) => {
  Order.find({
    completed: true,
    adminDecidedReturn: false,
    accountantDecided: false
  })
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .exec()
    .then(orders => {
      orders = orders.filter(order => order.clientType === 'corporate' && order.paymentMethod === 'notCash');
      return res.json(orders);
    })
    .catch(err => {
      console.log('Accountant getQueries ERROR', err);
      res.status(400).json(err);
    });
};


exports.getQueryById = (req, res) => {
  Order.findById(req.body.id)
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .exec()
    .then(order => res.json(order))
    .catch(err => {
      console.log('Accountant getQueryById ERROR', err);
      res.status(400).json(err);
    });
};


exports.confirmQuery = (req, res) => {
  Order.findById(req.body.object.orderId)
    .then(order => {
      if (req.body.object.decision === 'back') {
        order.returnedBack = true;
        order.returnHandled = false;
        order.adminDecidedReturn = true;

        order.operatorDecided = false;
        order.operatorConfirmed = false;

        order.accountantDecided = false;
        order.accountantConfirmed = false;

        // return materials to disinfectors
        req.body.object.disinfectors.forEach(person => {
          User.findById(person.user._id)
            .then(user => {
              if (user) {
                user.returnMaterials(person.consumption);
              }
            });
        });

      } else {
        order.accountantDecided = true;
        order.accountantCheckedAt = new Date();

        if (req.body.object.decision === 'confirm') {
          order.accountantConfirmed = true;
          order.invoice = req.body.object.invoice;
          order.cost = req.body.object.cost;
        } else if (req.body.object.decision === 'reject') {
          order.accountantConfirmed = false;
        }

      }
      return order.save();
    })
    .then(savedOrder => res.json(savedOrder))
    .catch(err => {
      console.log('Accountant confirmQuery ERROR', err);
      res.status(400).json(err);
    });
};


// accountant sees statistics
exports.getAccStats = (req, res) => {
  Order.find({ clientType: 'corporate' })
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .exec()
    .then(orders => {
      let sortedOrders = [];
      if (req.body.object.type === 'month') {
        sortedOrders = orders.filter(order =>
          new Date(order.dateFrom).getMonth() === req.body.object.month &&
          new Date(order.dateFrom).getFullYear() === req.body.object.year
        );
      } else if (req.body.object.type === 'week') {
        sortedOrders = orders.filter(order =>
          new Date(order.dateFrom) >= new Date(req.body.object.days[0]) &&
          new Date(order.dateFrom).setHours(0, 0, 0, 0) <= new Date(req.body.object.days[6])
        );
      } else if (req.body.object.type === 'day') {
        sortedOrders = orders.filter(order =>
          new Date(order.dateFrom).setHours(0, 0, 0, 0) === new Date(req.body.object.day).setHours(0, 0, 0, 0)
        );
      }
      return res.json({
        method: req.body.object.type,
        orders: sortedOrders
      });
    })
    .catch(err => {
      console.log('Accountant getAccStats ERROR', err);
      res.status(400).json(err);
    });
};


// exports.searchContracts = (req, res) => {
//   // case insensitive search
//   Order.find({ contractNumber: new RegExp(`^${req.body.object.payload}$`, 'i') })
//     .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
//     .exec()
//     .then(orders => res.json(orders))
//     .catch(err => {
//       console.log('Accountant searchContracts ERROR', err);
//       res.status(400).json(err);
//     });
// };