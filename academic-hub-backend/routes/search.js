const express = require('express');
const { searchAll } = require('../controllers/search');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(searchAll);

module.exports = router;
