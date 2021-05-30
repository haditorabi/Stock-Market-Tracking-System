const {ratings, validate} = require('../models/rating');
const {Users} = require('../models/users');
const {products} = require('../models/products');
const mongoose = require('mongoose');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
//   console.log(req.body.rate);
//   return;
    const user = await Users.findOne({ email: req.user.email });
    if (!user) return res.status(400).send('Invalid user.');
  
    const product = await products.findById(req.body.productId);
    if (!product) return res.status(400).send('Invalid product.');
  
  
    let rating = new ratings({ 
      user: {
        _id: user._id,
        name: user.name, 
      },
      product: {
        _id: product._id,
        name: product.name,
      },
      rating: req.body.rate
    });
    rating.save();
    res.send(rating);
});



router.get('/:productId', async (req, res) => {
//   const rating = await ratings.findById(req.params.productId);
const rate = ratings.aggregate([
    {
      $group: {
        _id: req.params.productId,
        avgrating: {
          $avg: "$rating"
        }
      }
    }
  ]);
console.log(rate);
if (!rate) return res.status(404).send('The rating with the given ID was not found.');

res.send(rate);
});

module.exports = router; 