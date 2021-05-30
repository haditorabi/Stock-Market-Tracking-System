const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const moment = require('moment');

const orderSchema = new mongoose.Schema({
  user: { 
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
      },   
    }),  
    required: true
  },
  product: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      price: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255,
        default: 0
      }   
    }),
    required: true
  },
  dateOfBuy: { 
    type: Date, 
    required: true,
    default: Date.now
  }
});

const order = mongoose.model('orders', orderSchema);

function validateOrder(order) {
  const schema = Joi.object({
    productId: Joi.objectId().required()
  });
  return schema.validate(order);
}

exports.orders = order; 
exports.validate = validateOrder;