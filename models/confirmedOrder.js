const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const confirmedOrderSchema = new Schema({
  completeOrderId: {
    type: Schema.Types.ObjectId,
    ref: 'CompleteOrder',
    required: true
  },
  disinfectorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
  orderDate: {
    type: Date,
    required: true
  },
  confirmedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ConfirmedOrder', confirmedOrderSchema);