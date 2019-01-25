let passport = require("passport");
let User = require("../models/user");
let LocalStrategy = require("passport-local").Strategy;



passport.serializeUser(function(user, done) {
    done(null, user.id); //means whenever you want to store the user in the session store the user's serialize id
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user); //allows passport to store and retrieve id from sessions
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallBack: true
}, function(req, email, password, done) {
    User.findOne({'email': email}, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (user) {
            return done(null, false, {message: 'Email is already in use'});
        }
        
        // let newUser = new User();
        // newUser.email = email;
        // newUser.password = newUser.encryptPassword(password);
        // newUser.firstName = req.body.firstName;
        // newUser.lastName = req.body.lastName;
        // newUser.contactNumber = req.body.contactNumber;
        // newUser.address = req.body.address;
        
        // newUser.save(function(err, result) {
        //     if (err) {
        //         console.log(err);
        //     }
            
        // });
    });
}));