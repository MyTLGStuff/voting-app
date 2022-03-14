const passport = require('passport');

exports.auth_login_get = (req, res) => {
    res.render('login', {
        Title: 'Login'
    });
};


// Login post call authentication
exports.auth_login_post = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log('First if error')
            return res.status(400).json({errors: err});
        }
        if (!user) {
            console.log('Second if error')
            return res.status(400).json({errors: 'No user found'});
        }
        req.logIn(user, (err) => {
            if (err) {
                console.log('logIn if error')
                return res.status(400).json({errors:err});
            }
            console.log('Logged in')
            return res.status(200).json({success: `logged in ${user.id}`});
        });
    }) (req, res, next)
};

exports.auth_login_get = (req, res) => {
    res.render('login', {
        Title: 'Login'
    });
};