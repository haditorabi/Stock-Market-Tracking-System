const Joi = require('joi');
const _ = require('lodash');
const {generateAuthToken, Users, validatePassword} = require('../models/users');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const response = validate(req.body);
    
    if(response.error) return res.status(400).send(response.error.details[0].message);

    let user = await Users.findOne({ email: req.body.email });
    if(!user) return res.status(400).send("Invalid mail or password");

    const validPassword = await validatePassword(user, req.body.password);
    if(!validPassword) return res.status(400).send("Invalid mail or password");

    const token = generateAuthToken(user);
    res.send(token);
})

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
    });
    return schema.validate(req);
};
module.exports = router;