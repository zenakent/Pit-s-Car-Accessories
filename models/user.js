var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var validator = require('validator');
var bcrypt = require("bcrypt");
require('mongoose-type-email');

var UserSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
        validate: [validator.isEmail, 'invalid email'],
    },
    password: {
        type: String, 
        required: 'You must provide an password',
    },
    firstName: {
        type: String, 
        required: 'You must provide your first name',
    },
    lastName: {
        type: String, 
        required: 'You must provide your last name',
    },
    address: {
        type: String, 
        required: 'You must provide your address',
    },
    contactNumber: {
        type: Number, 
        required: 'You must provide a phone/mobile number',
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    notifications: [
    	{
    	   type: mongoose.Schema.Types.ObjectId,
    	   ref: 'Notification'
    	}
    ],
    isActivated: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    emailToken: String,
    resetPasswordExpires: Date,
});

UserSchema.methods.encyrptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSalt(8), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);  
};

UserSchema.plugin(passportLocalMongoose , { usernameField : 'email' });

module.exports = mongoose.model("Users", UserSchema);