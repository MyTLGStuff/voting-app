const express = require('express');
const user_controller = require('../controllers/user_controller');
const router = express.Router();

// GET request for creating a User. NOTE This must come before routes that display User (uses id).
router.get('/create', user_controller.user_create_get);

// POST request for creating User.
router.post('/create', user_controller.user_create_post);

// GET request to delete User.
router.get('/:id/delete', user_controller.user_delete_get);

// POST request to delete User.
router.post('/:id/delete', user_controller.user_delete_post);

// GET request to update User.
router.get('/:id/update', user_controller.user_update_get);

// POST request to update User.
router.post('/:id/update', user_controller.user_update_post);

// GET request for one User.
router.get('/:id', user_controller.user_detail);

// GET request for list of all User items.
router.get('/', user_controller.user_index);

module.exports = router;