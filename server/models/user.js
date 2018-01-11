const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true,
        minlength: 1,
        trim: true, 
        minlength: 1, 
        unique: true, 
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid Email'
        } 
    }, 
    password: { type: String, require: true, minlength: 6}, 
    tokens: [{
        access: {type: String, required: true},
        token: {type: String, required: true}
    }] 
});

// Override the toJSON function, to limit what we send back to (we don't want to send back password and token)
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id','email']);
};

UserSchema.methods.generateAuthToken = function() {

    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'salty123!').toString();

    user.tokens.push({access, token});

    return  user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function(token) {

    var User = this;
    var decoded;

    console.log('token is: ', token);

    try {
        decoded = jwt.verify(token, 'salty123!');
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

};

var User = mongoose.model('Users', UserSchema);


module.exports = { User };