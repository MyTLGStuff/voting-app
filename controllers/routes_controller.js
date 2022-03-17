const express = require('express');
const moment = require('moment');

const router = express.Router();

const candidates = require('../models/candidate_model');
const users = require('../models/user_model');

exports.vote = (req, res) => {
    const newDate = new Date();
    const votedDate = new Date(newDate);
    votedDate.setHours(votedDate.getHours() + 1);
    const name = req.oidc.user.name;
    const email = req.oidc.user.email;

    users.findOne({
        email: email
    }, (err, doc) => {
        if (err) {
            console.error(err);
        }
        if (doc === null) {
            let user = {
                name: name,
                email: email,
                voted: votedDate
            }
            users.create(user)
        } else {
            users.findOneAndUpdate({
                email: email
            }, {
                voted: votedDate,
                new: true
            }, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
    })
    candidates.findByIdAndUpdate({
        _id: req.params.id
    }, {
        $inc: {
            votes: 1
        },
        new: true
    }, (err) => {
        if (err) {
            console.error(err);
        }
    })
    res.redirect('/')
};

// retreive all candidates
exports.index = (req, res) => {
    let email = null;
    if (req.oidc.isAuthenticated()) {
        email = req.oidc.user.email;
    }
    candidates.find()
        .then(results => {
            users.findOne({
                email: email
            }, (err, doc) => {
                if (err) {
                    console.error(err);
                }
                if (doc === null) {
                    res.render('index', {
                        title: 'Top Modern Muscle Cars',
                        message: '',
                        candidates: results,
                        isAuthenticated: req.oidc.isAuthenticated(),
                        oidc: req.oidc.user,
                        voteTime: null,
                        notVoted: email === null ? false : true
                    });
                } else {
                    users.findOne({
                            email: email
                        })
                        .then(user => {
                            res.render('index', {
                                title: 'Top Modern Muscle Cars',
                                message: '',
                                candidates: results,
                                isAuthenticated: req.oidc.isAuthenticated(),
                                user: user,
                                oidc: req.oidc.user,
                                voteTime: user.voted,
                                notVoted: (user.voted <= Date.now())
                            });
                        });
                }
            })
        })
        .catch(err => console.error(err));
};