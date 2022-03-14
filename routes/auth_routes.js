const express = require('express');
const auth_controller = require('../controllers/auth_controller');
const router = express.Router();

// GET request for verifying authorized user.
router.get('/login', auth_controller.auth_login_get)

// POST request for verifying authorized user.
router.post('/register_login', auth_controller.auth_register_login_post);

module.exports = router;