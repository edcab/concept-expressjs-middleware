const router = require('express').Router();
const passport = require('passport');
const validPassword = require('../lib/passwordUtils').validPassword;
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const {isAuth, isAdmin} = require('./authMiddleware')
const User = connection.models.User;

/**
 * -------------- POST ROUTES ----------------
 */

router.post('/login', passport.authenticate('local',
    { failureRedirect: '/login-failure', successRedirect: '/login-success' }
));

router.post('/register', (req, res, next) => {
    const saltHash = genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        usertype: req.body.usertype,
        hash: hash,
        salt: salt
    });

    // we need to validate that the user doesn't already exist

    User.countDocuments({ username: req.body.username }, (err, existingUser) => {
        if (err) { return next(err); }

        if (existingUser > 0) {
            console.log('Username already exists');
            return res.redirect('/login');
        } else {
            newUser.save()
                .then((user) => {
                    console.log(user);
                });

            res.redirect('/login');
        }
    });


});





/**
* -------------- GET ROUTES ----------------
*/

router.get('/', (req, res, next) => {
    res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
// passport.authenticate('local') it's a middleware that will check if the user is authenticated or not using the local strategy
// If the user is authenticated, it will call the next middleware in the stack, in this case the callback function (req, res, next) => {}
router.get('/login', (req, res, next) => {

    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br>Select User Type:<br>\
    <select name="usertype">\
        <option value="user">User</option>\
        <option value="admin">Admin</option>\
    </select>\
    <br><br><input type="submit" value="Submit"></form>';


    res.send(form);

});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br>Select User Type:<br>\
                    <select name="usertype">\
                        <option value="user">User</option>\
                        <option value="admin">Admin</option>\
                    </select>\
                    <br><br><input type="submit" value="Submit"></form>';


    res.send(form);

});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 * 
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/protected-route', isAuth,  (req, res, next) => {
   res.send('<h1>You are authenticated on protected-route</h1>');
});

router.get('/admin-route', isAuth, isAdmin,  (req, res, next) => {
    res.send('<h1>Hello admin! </h1>');
 });

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/protected-route');
});

router.get('/login-success', (req, res, next) => {

    if(req.user.usertype === 'admin') {
        res.send('<p>You successfully logged in as admin. --> <a href="/admin-route">Go to admin route</a></p>');
    }
    res.send('<p>You successfully logged in as User. --> <a href="/protected-route">Go to user route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;