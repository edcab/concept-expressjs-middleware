const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const User = connection.models.User;
const validPassword = require('../lib/passwordUtils').validPassword;

const customFields = {
    usernameField: 'username',
    passwordField: 'password'
};

/**
 * 
 * This methos is automatically called by passport.authenticate('local') when we call it in the POST /login route in routes/index.js 
 * 
 * This method is called when we want to authenticate a user.  We provide the username and password
 * and this method will determine if the user is valid or not.  If the user is valid, we call the done
 * method with the user object.  If the user is invalid, we call the done method with no user object
 * and a false boolean.
 * 
 * @param {*} username 
 * @param {*} password 
 * @param {*} done 
 */ 
const verifyCallback = (username, password, done) => {

    User.findOne({ username: username })
        .then((user) => {

            if (!user) { 
                console.log('User not found');
                return done(null, false) 
            }
            
            const isValid = validPassword(password, user.hash, user.salt);
            
            if (isValid) {
                console.log('User is valid');
                return done(null, user);
            } else {
                console.log('User is invalid');
                return done(null, false);
            }
        })
        .catch((err) => {   
            done(err);
        });

}

/**
 * 
 */
const strategy = new LocalStrategy(customFields, verifyCallback)

/* now we tell passport to use this strategy on our User model and to serialize and deserialize the user
passport.serializeUser((user, done) => {  
    done(null, user.id);
});*/
passport.use(strategy);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id).then(function (user) {
        done(null, user);
    }).catch(function (err) {
        done(err, null);
    });
});