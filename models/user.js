const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  occupation: {
    type: String,
    required: true
  },
  materials: [
    {
      material: {
        type: String,
        default: 'Вещество 1'
      },
      amount: {
        type: Number,
        default: 0
      },
      unit: {
        type: String,
        default: 'гр'
      }
    }
  ],
  color: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },

  birthday: {
    type: Date
  },
  married: {
    type: Boolean
  },
  hasChildren: {
    type: Boolean
  },
  children: {
    type: Number
  }
});

userSchema.methods.subtractConsumptionMaterials = function (consumptionArray) {
  consumptionArray.forEach(item => {
    this.materials.forEach(thing => {
      if (thing.material === item.material && thing.unit === item.unit) {
        thing.amount -= item.amount;
        return;
      }
    });
  });
  return this.save();
};

module.exports = mongoose.model('User', userSchema);