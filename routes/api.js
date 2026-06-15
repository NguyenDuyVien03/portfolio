const express = require('express');
const { postContact, getGitHubApi } = require('../controllers/contactController');

const router = express.Router();

router.post('/contact', postContact);
router.get('/github', getGitHubApi);

module.exports = router;
