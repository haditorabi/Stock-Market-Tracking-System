const {orders, validate} = require('../models/orders');
const {Users} = require('../models/users');
const {products} = require('../models/products');
const mongoose = require('mongoose');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Fawn = require('fawn');
Fawn.init(mongoose);

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
//   console.log(req.user.email);
    const user = await Users.findOne({ email: req.user.email });

    if (!user) return res.status(400).send('Invalid user.');
  
    const product = await products.findById(req.body.productId);
    if (!product) return res.status(400).send('Invalid product.');
  
    if (product.numberInStock === 0) return res.status(400).send('Product not in stock.');
  
    let order = new orders({ 
      user: {
        _id: user._id,
        name: user.name, 
      },
      product: {
        _id: product._id,
        name: product.title,
        price: product.price
      }
    });
  
    try {
      new Fawn.Task()
        .save('orders', order)
        .update('products', { _id: product._id }, { 
          $set: { numberInStock: -1 }
        })
        .run();
    
      res.send(order);
    }
    catch(ex) {
      res.status(500).send('Something in order failed.');
    }
});



router.get('/:orderId', async (req, res) => {
  const order = await orders.findById(req.params.orderId);

  if (!order) return res.status(404).send('The order with the given ID was not found.');

  res.send(_.pick(order,['user',"product", "dateOfBuy"]));
});

module.exports = router; 