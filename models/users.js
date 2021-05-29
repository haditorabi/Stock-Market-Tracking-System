// const users = require('./fakeUsers');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
    },
    balance: {
        type: Number,
        minlength: 0,
        maxlength: 255
    }
  });

function validatePassword(userObj, password) {
    return userObj.password === password;
}
// userSchema.methods.generateAuthToken = function() { 
//     const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
//     return token;
// }
function generateAuthToken (user) { 
    const token = jwt.sign({ email: user.email }, config.get('jwtPrivateKey'));
    return token;
}
function validateUser (user) {
    const schema = Joi.object().keys({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(user);
}
const Users = mongoose.model("User", userSchema);
exports.validatePassword = validatePassword;
exports.generateAuthToken = generateAuthToken;
exports.validate = validateUser;
exports.Users = Users;
