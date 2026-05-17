const express = require('express');
const router = express.Router();
const controller = require('../controllers/medicineController');
const requireAuth = require('../middleware/requireAuth');

router.get('/', requireAuth, controller.getCategories);

module.exports = router;