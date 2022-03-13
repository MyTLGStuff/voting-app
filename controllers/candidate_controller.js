const candidates = require('../models/candidate_model');

// Display index of Candidates.
exports.candidate_index = (req, res) => {
    candidates.find()
        .then(results => {
            res.render('./candidate/index', {
                title: 'Candidate Index',
                candidate_index: results,
            });
        })
        .catch(err => console.error(err));
};

// Display detail page for a specific Candidate.
exports.candidate_detail = (req, res) => {
    candidates.findOne({
            _id: req.params.id
        })
        .then(detail_candidate => {
            res.render('./candidate/detail', {
                title: detail_candidate.name + ' Detail',
                candidate_detail: detail_candidate,
            });
        })
        .catch(err => console.error(err));
};

// Display Candidate create form on GET.
exports.candidate_create_get = (req, res) => {
    res.render('./candidate/create', {
        title: 'Create Candidate',
    });
};

// Handle Candidate create on POST.
exports.candidate_create_post = (req, res) => {
    const name = req.body.name;
    const srcUrl = req.body.srcUrl;
    const altText = name + ' photo';
    let candidate = {
        name,
        srcUrl,
        altText
    };
    candidate.save()
        .then(results => {
            res.redirect('./candidate/index', {
                    candidates: results,
                    message: 'New candidate added'
                })
                .catch(err => console.error(err));
        });
};

// Handle Candidate delete on POST.
exports.candidate_delete_post = (req, res) => {
    candidates.findByIdAndDelete(req.params.id)
        .then(results => {
            res.json({
                redirect: './candidate/index',
            });
        })
        .catch(error => console.error(error));
};

// Display Candidate update form on GET.
exports.candidate_update_get = (req, res) => {
    candidates.findById(req.params.id)
        .then(result => {
            res.render('./candidate/update', {
                title: 'Update ' + result.name,
                candidate: result,
            });
        });
};

// Handle candidate update on POST.
exports.candidate_update_post = (req, res) => {
    candidates.findByIdAndUpdate({
            _id: req.params.id
        }, {
            name: req.body.name
        }, {
            srcUrl: req.body.srcUrl
        }, {
            altText: req.body.name + ' photo'
        }, {
            upsert: true
        })
        .then(result => {
            console.log(result);
            candidates.findById(req.params.id)
                .then(result => {
                    res.render('./candidate/update', {
                        candidate: result,
                        notVoted: false
                    })
                })
        })
        .catch(error => console.error(error));
};