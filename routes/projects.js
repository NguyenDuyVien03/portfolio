const express = require('express');
const { getProjectDetail } = require('../controllers/projectController');

const router = express.Router();

router.get('/:slug', getProjectDetail);

module.exports = router;
