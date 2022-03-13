const express = require('express');
const router = express.Router();

const candidates = require('../models/candidate_model');

router.get('/vote/:id', (req, res) => {
    candidates.findByIdAndUpdate({
            _id: req.params.id
        }, {
            $inc: {
                votes: 1
            }
        })
        .then(result => {
            console.log(result);
            candidates.find()
                // need to update variable names
                .then(results => {
                    res.render('index', {
                        candidates: results,
                        notVoted: false
                    })
                })
        })
        .catch(error => console.error(error));
});

// retreive all candidates
router.get('/', (req, res) => {
    candidates.find()
        .then(results => {
            res.render('index', {
                candidates: results,
                notVoted: true
            });
        })
        .catch(err => console.error(err));
});

module.exports = router;