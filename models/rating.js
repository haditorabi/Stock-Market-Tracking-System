const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
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
    }),
    required: true
  },
  rating: { 
    type: Number, 
    required: true,
    default: 0
  }
});

const rating = mongoose.model('ratings', ratingSchema);

function validateRating(rating) {
  const schema = Joi.object({
    productId: Joi.objectId().required(),
    rate: Joi.number().required()
  });
  return schema.validate(rating);
}

exports.ratings = rating; 
exports.validate = validateRating;