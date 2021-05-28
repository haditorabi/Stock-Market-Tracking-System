const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {user, searchUsers, validatePassword} = require('users');
const express = require('express');
const router = express.router();

router.post('/', async (req, res) => {
    const error = Joi.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await searchUsers({email: req.body.email});
    if(!user) return res.status(400).send("Invalid mail or password");

    const validPassword = await validatePassword(user, req.body.password);
    if(!validPassword) return res.status(400).send("Invalid mail or password");

    const token = user.generateToken();
    res.send(token);
})

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
    }
    return Joi.validate(req, schema);
}
module.exports = router;