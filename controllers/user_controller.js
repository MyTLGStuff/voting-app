const users = require('../models/user_model');

// Display the index of Users.
exports.user_index = (req, res) => {
    users.find()
        .then(results => {
            res.render('./user/index', {
                title: 'User List',
                user_index: results,
            });
        })
        .catch(err => console.error(err));
};

// Display detail page for a specific User.
exports.user_detail = (req, res) => {
    users.findOne({
            _id: req.params.id
        })
        .then(detail_user => {
            res.render('./user/detail', {
                title: detail_user.name + ' Detail',
                user_detail: detail_user,
            });
        })
        .catch(err => console.error(err));
};

// Display User create form on GET.
exports.user_create_get = (req, res) => {
    res.render('./user/create', {
        title: 'Create User',
    });
};

// Handle User create on POST.
exports.user_create_post = (req, res) => {
    const name = req.body.name;
    const srcUrl = req.body.srcUrl;
    const altText = name + ' photo';
    let user = {
        name,
        srcUrl,
        altText
    };
    user.save()
        .then(results => {
            res.redirect('./user/index', {
                    userss: results,
                    message: 'New user added'
                })
                .catch(err => console.error(err));
        });
};

// Handle User delete on POST.
exports.user_delete_post = (req, res) => {
    users.findByIdAndDelete(req.params.id)
        .then(results => {
            res.json({
                redirect: './user/index',
            });
        })
        .catch(error => console.error(error));
};

// Display User update form on GET.
exports.user_update_get = (req, res) => {
    users.findById(req.params.id)
        .then(result => {
            res.render('./user/update', {
                title: 'Update ' + result.name,
                user: result,
            });
        });
};

// Handle user update on POST.
exports.user_update_post = (req, res) => {
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