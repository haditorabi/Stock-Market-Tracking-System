const Joi = require('joi');
const mongoose = require('mongoose');

const products = mongoose.model('products', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, 
    minlength: 5,
    maxlength: 255
  },
  numberInStock: { 
    type: Number, 
    required: true,
    min: 0,
    max: 255
  },

}));

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    numberInStock: Joi.number().min(0).required(),
  });
  return schema.validate(product);
}

exports.products = products; 
exports.validate = validateProduct;