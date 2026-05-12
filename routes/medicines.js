const express = require('express');
const router = express.Router();
const controller = require('../controllers/medicineController');

/**
 * @swagger
 * tags:
 *   name: Medicines
 *   description: Medicine management
 */

/**
 * @swagger
 * /api/medicines:
 *   get:
 *     summary: Get all medicines (supports ?search=query)
 *     tags: [Medicines]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by medicine name
 *     responses:
 *       200:
 *         description: List of medicines
 */
router.get('/', controller.getAllMedicines);

/**
 * @swagger
 * /api/medicines/{id}:
 *   get:
 *     summary: Get a medicine by ID
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Medicine object
 *       404:
 *         description: Not found
 */
router.get('/:id', controller.getMedicineById);

/**
 * @swagger
 * /api/medicines:
 *   post:
 *     summary: Create a new medicine
 *     tags: [Medicines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [medicineName, dosage, stockAmount, expirationDate]
 *             properties:
 *               medicineName:
 *                 type: string
 *               dosage:
 *                 type: string
 *               stockAmount:
 *                 type: integer
 *               expirationDate:
 *                 type: string
 *                 format: date
 *               categoryId:
 *                 type: integer
 *               reminderTime:
 *                 type: string
 *               frequency:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created medicine
 *       400:
 *         description: Validation errors
 */
router.post('/', controller.createMedicine);

/**
 * @swagger
 * /api/medicines/{id}:
 *   put:
 *     summary: Update a medicine
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated medicine
 *       404:
 *         description: Not found
 */
router.put('/:id', controller.updateMedicine);

/**
 * @swagger
 * /api/medicines/{id}:
 *   delete:
 *     summary: Delete a medicine
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', controller.deleteMedicine);

/**
 * @swagger
 * /api/medicines/{id}/log-dose:
 *   post:
 *     summary: Log a dose taken for a medicine
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dose logged
 */
router.post('/:id/log-dose', controller.logDose);

/**
 * @swagger
 * /api/medicines/{id}/logs:
 *   get:
 *     summary: Get dose history for a medicine
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of dose logs
 */
router.get('/:id/logs', controller.getDoseLogs);

module.exports = router;
