const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  disinfectorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  client: {
    type: String
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  phone2: {
    type: String
  },
  dateFrom: {
    type: Date
  },
  typeOfService: {
    type: String
  },
  advertising: {
    type: String
  },
  comment: {
    type: String
  },
  disinfectorComment: {
    type: String
  },
  userCreated: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  // repeat order
  repeatedOrder: {
    type: Boolean,
    default: false
  },
  timeOfRepeat: {
    type: Date // приблизительное время повторного заказа
  },
  previousOrder: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  repeatedOrderDecided: {
    type: Boolean,
    default: false
  },
  repeatedOrderNeeded: {
    type: Boolean
  },

  // disinfector completes the order
  completed: {
    type: Boolean,
    default: false
  },
  consumption: [{
    material: {
      type: String
    },
    amount: {
      type: Number
    },
    unit: {
      type: String
    }
  }],
  guarantee: {
    type: Number // in months
  },
  paymentMethod: {
    type: String
  },
  invoice: {
    type: Number
  },
  cost: {
    type: Number
  },
  completedAt: {
    type: Date
  },


  // operator
  clientReview: {
    type: String
  },
  score: {
    type: Number
  },
  operatorCheckedAt: {
    type: Date
  },
  operatorDecided: {
    type: Boolean,
    default: false
  },
  operatorConfirmed: {
    type: Boolean,
    default: false
  },


  // for admin
  adminCheckedAt: {
    type: Date
  },
  adminDecided: {
    type: Boolean,
    default: false
  },
  adminConfirmed: {
    type: Boolean,
    default: false
  },


  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);