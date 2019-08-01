const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const completeOrderSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  disinfectorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  consumption: {
    type: String,
    required: true
  },
  clientReview: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CompleteOrder', completeOrderSchema);