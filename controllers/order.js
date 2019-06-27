const User = require('../models/user');
const Order = require('../models/order');
const validateOrderInput = require('../validation/order')


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
    comment: req.body.comment
  });

  order.save()
    .then(() => res.redirect('/'))
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