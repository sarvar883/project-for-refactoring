const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }],
  createdAt: {
    type: Date
  }
});

module.exports = mongoose.model('Client', clientSchema);