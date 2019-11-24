const Order = require('../models/order');
const AddMaterial = require('../models/addMaterial');


exports.monthStatsForDisinfector = async (req, res) => {
  const id = req.body.id;
  const month = Number(req.body.month);
  const year = Number(req.body.year);
  let acceptedOrders = [];

  let addedMaterials = await AddMaterial.find({ disinfector: id }).populate('disinfector admin').exec();

  addedMaterials = addedMaterials.filter(item =>
    new Date(item.createdAt).getMonth() === month &&
    new Date(item.createdAt).getFullYear() === year
  );

  Order.find()
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .exec()
    .then(orders => {
      acceptedOrders = orders.filter(item => item.userAcceptedOrder._id.toString() === id && new Date(item.dateFrom).getMonth() === month && new Date(item.dateFrom).getFullYear() === year);

      orders = orders.filter(item => {
        let amongDisinfectors = 0;
        item.disinfectors.forEach(element => {
          if (element.user._id.toString() === id) amongDisinfectors++;
        });
        if (item.disinfectorId._id.toString() === id || amongDisinfectors > 0) {
          return true;
        } else {
          return false;
        }
      });

      orders = orders.filter(order =>
        new Date(order.dateFrom).getMonth() === month &&
        new Date(order.dateFrom).getFullYear() === year
      );

      return res.json({
        orders: orders,
        acceptedOrders: acceptedOrders,
        addedMaterials: addedMaterials
      });
    })
    .catch(err => {
      console.log('monthStatsForDisinfector ERROR', err);
      res.status(404).json(err);
    });
};


exports.weekStatsForDisinfector = async (req, res) => {
  const id = req.body.id;
  const days = req.body.days;
  let acceptedOrders = [];

  let addedMaterials = await AddMaterial.find({ disinfector: id })
    .populate('disinfector admin')
    .exec();

  addedMaterials = addedMaterials.filter(item =>
    new Date(item.createdAt) >= new Date(days[0]) &&
    new Date(item.createdAt).setHours(0, 0, 0, 0) <= new Date(days[6])
  );

  Order.find()
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .exec()
    .then(orders => {
      acceptedOrders = orders.filter(item => item.userAcceptedOrder._id.toString() === id && new Date(item.dateFrom) >= new Date(days[0]) && new Date(item.dateFrom).setHours(0, 0, 0, 0) <= new Date(days[6]));

      orders = orders.filter(item => {
        let amongDisinfectors = 0;
        item.disinfectors.forEach(element => {
          if (element.user._id.toString() === id) amongDisinfectors++;
        });
        if (item.disinfectorId._id.toString() === id || amongDisinfectors > 0) {
          return true;
        } else {
          return false;
        }
      });

      orders = orders.filter(order =>
        new Date(order.dateFrom) >= new Date(days[0]) &&
        new Date(order.dateFrom).setHours(0, 0, 0, 0) <= new Date(days[6])
      );
      return res.json({
        orders: orders,
        acceptedOrders: acceptedOrders,
        addedMaterials: addedMaterials
      });
    })
    .catch(err => {
      console.log('weekStatsForDisinfector ERROR', err);
      res.status(404).json(err);
    });
};


exports.monthStatsForAdmin = (req, res) => {
  const month = Number(req.body.month);
  const year = Number(req.body.year);

  Order.find()
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .exec()
    .then(orders => {
      orders = orders.filter(order =>
        new Date(order.dateFrom).getMonth() === month &&
        new Date(order.dateFrom).getFullYear() === year
      );
      return res.json(orders);
    })
    .catch(err => {
      console.log('monthStatsForAdmin ERROR', err);
      res.status(404).json(err);
    });
};


exports.weekStatsForAdmin = (req, res) => {
  const days = req.body.days;

  Order.find()
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .exec()
    .then(orders => {
      orders = orders.filter(order =>
        new Date(order.dateFrom) >= new Date(days[0]) &&
        new Date(order.dateFrom).setHours(0, 0, 0, 0) <= new Date(days[6])
      );
      return res.json(orders);
    })
    .catch(err => {
      console.log('weekStatsForAdmin ERROR', err);
      res.status(404).json(err);
    });
};


exports.disinfMonthStatsForAdmin = (req, res) => {
  const id = req.body.id;
  const month = Number(req.body.month);
  const year = Number(req.body.year);
  let acceptedOrders = [];

  Order.find()
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .exec()
    .then(orders => {
      acceptedOrders = orders.filter(item => item.userAcceptedOrder._id.toString() === id && new Date(item.dateFrom).getMonth() === month && new Date(item.dateFrom).getFullYear() === year);

      orders = orders.filter(item => {

        let amongDisinfectors = 0;
        item.disinfectors.forEach(element => {
          if (element.user._id.toString() === id) amongDisinfectors++;
        });
        if (item.disinfectorId._id.toString() === id || amongDisinfectors > 0) {
          return true;
        } else {
          return false;
        }
      });

      orders = orders.filter(order =>
        new Date(order.dateFrom).getMonth() === month &&
        new Date(order.dateFrom).getFullYear() === year
      );
      return res.json({
        disinfectorId: id,
        orders: orders,
        acceptedOrders: acceptedOrders
      });
    })
    .catch(err => {
      console.log('disinfMonthStatsForAdmin ERROR', err);
      res.status(404).json(err);
    });
};


exports.disinfWeekStatsForAdmin = (req, res) => {
  const id = req.body.id;
  const days = req.body.days;
  let acceptedOrders = [];

  Order.find()
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .exec()
    .then(orders => {
      acceptedOrders = orders.filter(item => item.userAcceptedOrder._id.toString() === id && new Date(item.dateFrom) >= new Date(days[0]) && new Date(item.dateFrom).setHours(0, 0, 0, 0) <= new Date(days[6]));

      orders = orders.filter(item => {

        let amongDisinfectors = 0;
        item.disinfectors.forEach(element => {
          if (element.user._id.toString() === id) amongDisinfectors++;
        });
        if (item.disinfectorId._id.toString() === id || amongDisinfectors > 0) {
          return true;
        } else {
          return false;
        }
      });

      orders = orders.filter(order =>
        new Date(order.dateFrom) >= new Date(days[0]) &&
        new Date(order.dateFrom).setHours(0, 0, 0, 0) <= new Date(days[6])
      );
      return res.json({
        disinfectorId: id,
        orders: orders,
        acceptedOrders: acceptedOrders
      });
    })
    .catch(err => {
      console.log('disinfWeekStatsForAdmin ERROR', err);
      res.status(404).json(err);
    });
};


exports.getAdvStats = (req, res) => {
  Order.find()
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .exec()
    .then(orders => {
      let sortedOrders = [];
      if (req.body.object.type === 'month') {
        sortedOrders = orders.filter(order =>
          new Date(order.dateFrom).getMonth() === req.body.object.month &&
          new Date(order.dateFrom).getFullYear() === req.body.object.year
        );
      } else if (req.body.object.type === 'year') {
        sortedOrders = orders.filter(order =>
          new Date(order.dateFrom).getFullYear() === req.body.object.year
        );
      } else if (req.body.object.type === 'allTime') {
        sortedOrders = orders;
      }
      return res.json(sortedOrders);
    })
    .catch(err => {
      console.log('getAdvStats ERROR', err);
      res.status(404).json(err);
    });
};


exports.getOperatorStats = (req, res) => {
  Order.find({ userAcceptedOrder: req.body.object.operatorId })
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
      }
      return res.json({
        method: req.body.object.type,
        sortedOrders: sortedOrders
      });
    })
    .catch(err => {
      console.log('getOperatorStats ERROR', err);
      res.status(404).json(err);
    });
};