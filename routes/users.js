const auth = require('../middleware/auth');
const {Users} = require('../models/users');
const _ = require('lodash');
const Joi = require('Joi');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    // const user = await (req.user._id);
    res.send(req.user);
});
router.post('/balance', auth, async (req, res) => {
    const { error } = validateBalance(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    console.log(req.user);
    let user = await Users.findOne({ email: req.user.email });
  
    user.balance = req.body.balance;
    await user.save();
    return res.sendStatus(200).send(user.balance);
  
  });
function validateBalance(req) {
    const schema = Joi.object({
        balance: Joi.number().min(0).max(255).required(),
    });
    return schema.validate(req);
};
module.exports = router;