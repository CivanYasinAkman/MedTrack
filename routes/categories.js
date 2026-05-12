const express = require('express');
const router = express.Router();
const controller = require('../controllers/medicineController');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Medicine categories
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/', controller.getCategories);

module.exports = router;
