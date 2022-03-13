const express = require('express');
const candidate_controller = require('../controllers/candidate_controller');
const router = express.Router();

// GET request for list of all Candidate items.
router.get('/', candidate_controller.candidate_index);

// GET request for creating a Candidate. NOTE This must come before routes that display Candidate (uses id).
router.get('/create', candidate_controller.candidate_create_get);

// POST request for creating Candidate.
router.post('/create', candidate_controller.candidate_create_post);

// GET request for one Candidate.
router.get('/:id', candidate_controller.candidate_detail);

// POST request to delete Candidate.
router.post('/:id/delete', candidate_controller.candidate_delete_post);

// GET request to update Candidate.
router.get('/:id/update', candidate_controller.candidate_update_get);

// POST request to update Candidate.
router.post('/:id/update', candidate_controller.candidate_update_post);

module.exports = router;