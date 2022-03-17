const express = require('express');
const {
    requiresAuth
} = require('express-openid-connect');

const routes_controller = require('../controllers/routes_controller');
const router = express.Router();

// GET homepage
router.get('/', routes_controller.index);

// GET vote for candidate
router.get('/vote/:id', requiresAuth(), routes_controller.vote);

module.exports = router;