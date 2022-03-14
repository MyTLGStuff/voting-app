const express = require('express');
const router = express.Router();

const passport = require('passport');

const candidates = require('../models/candidate_model');
const users = require('../models/user_model');

router.get('/vote/:id', (req, res, next) => {
    if (!req.user) {
        res.redirect('/');
    } else {
        candidates.findByIdAndUpdate({
            _id: req.params.id
        }, {
            $inc: {
                votes: 1
            }
        })
        next()
        candidates.find()
            .then(results => {
                res.render('index', {
                    candidates: results,
                    notVoted: true
                });
            })
    }
});

// retreive all candidates
router.get('/', (req, res) => {
    if (req.user) {
        candidates.find()
            .then(results => {
                res.render('index', {
                    candidates: results,
                    notVoted: false
                });
            })
            .catch(err => console.error(err));
    } else {
        res.render('login')
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    // failureFlash: true
 }))

module.exports = router;