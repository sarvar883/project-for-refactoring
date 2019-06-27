const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  disinfectorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  typeOfService: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  comment: {
    type: String
  }
});

module.exports = mongoose.model('Order', orderSchema);