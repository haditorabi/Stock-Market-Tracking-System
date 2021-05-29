const {products, validate} = require('../models/products'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
router.get('/', async (req, res) => {
  const product = await products.find().sort('name');
  res.send(product);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);


  const product = new products({ 
    name: req.body.name,
    numberInStock: req.body.numberInStock,
  });
  await product.save();
  
  res.send(product);
});

router.put('/:id', auth, async (req, res) => {
  const validObj = mongoose.isValidObjectId(req.params.id); 
  if (!validObj) return res.status(400).send("invalid ID");

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);


  const product = await products.findByIdAndUpdate(req.params.id,
    { 
      name: req.body.name,
      numberInStock: req.body.numberInStock,
    }, { new: true });

  if (!product) return res.status(404).send('The product with the given ID was not found.');
  
  res.send(product);
});

router.delete('/:id', auth, async (req, res) => {
  const validObj = mongoose.isValidObjectId(req.params.id); 
  if (!validObj) return res.status(400).send("Invalid ID");

  const product = await products.findByIdAndRemove(req.params.id);

  if (!product) return res.status(404).send('The product with the given ID was not found.');

  res.send(product);
});

router.get('/:id', async (req, res) => {
  const product = await products.findById(req.params.id);

  if (!product) return res.status(404).send('The product with the given ID was not found.');

  res.send(product);
});

module.exports = router; 