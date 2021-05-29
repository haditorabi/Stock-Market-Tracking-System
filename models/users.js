const users = require('./fakeUsers');
const jwt = require('jsonwebtoken');
const config = require('config');

function searchUserEmail (email) {
    user = users.find(u => u.email === email);
    return user;
}
function validatePassword(userObj, password) {
    return userObj.password === password;
}
function generateAuthToken (user) { 
    const token = jwt.sign({ email: user.email }, config.get('jwtPrivateKey'));
    return token;
}    
exports.searchUserEmail = searchUserEmail;
exports.validatePassword = validatePassword;
exports.generateAuthToken = generateAuthToken;
