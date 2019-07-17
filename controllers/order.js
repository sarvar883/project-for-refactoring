const User = require('../models/user');
const Order = require('../models/order');
const validateOrderInput = require('../validation/order')
const validateDisinfectorCommentInput = require('../validation/disinfectorComment');
const io = require('../socket');

exports.getAllDisinfectors = (req, res) => {
  User.find({ occupation: 'disinfector' })
    .then(disinfectors => res.json(disinfectors))
    .catch(err => console.log('getAllDisinfectors ERROR', err))
};


exports.createOrder = (req, res) => {
  const { errors, isValid } = validateOrderInput(req.body);

  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  const order = new Order({
    disinfectorId: req.body.disinfectorId,
    client: req.body.client,
    address: req.body.address,
    date: req.body.date,
    phone: req.body.phone,
    typeOfService: req.body.typeOfService,
    comment: req.body.comment,
    disinfectorComment: ''
  });

  order.save()
    .then(() => {
      io.getIO().emit('createOrder', {
        disinfectorId: req.body.disinfectorId,
        order: order
      })
      return res.redirect('/')
    })
    .catch(err => {
      console.log('createOrder ERROR', err);
      res.status(400).json(err)
    });
};


// get orders for logged in disinfector
exports.getOrders = (req, res) => {
  Order.find({ disinfectorId: req.body.userId })
    .populate('disinfectorId')
    .exec()
    .then(orders => res.json(orders))
    .catch(err => {
      console.log('getOrders ERROR', err);
      res.status(404).json(err);
    });
};


// add disinfector comment to order
exports.addDisinfectorComment = (req, res) => {
  // const { errors, isValid } = validateDisinfectorCommentInput(req.body);

  // Check Validation
  // if (!isValid) {
  // Return any errors with 400 status
  // return res.status(400).json(errors);
  // }

  Order.findById(req.body.id)
    .then(order => {
      order.disinfectorComment = req.body.comment;
      order.save();
    })
    .catch(err => {
      console.log('getOrders ERROR', err);
    });
};