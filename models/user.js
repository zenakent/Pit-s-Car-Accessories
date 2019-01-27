var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var validator = require('validator');
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
});

UserSchema.plugin(passportLocalMongoose , { usernameField : 'email' });

module.exports = mongoose.model("Users", UserSchema);