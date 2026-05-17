const express = require('express');
const router = express.Router();
const controller = require('../controllers/medicineController');
const requireAuth = require('../middleware/requireAuth');

router.get('/', requireAuth, controller.getAllMedicines);
router.post('/', requireAuth, controller.createMedicine);
router.get('/:id', requireAuth, controller.getMedicineById);
router.put('/:id', requireAuth, controller.updateMedicine);
router.delete('/:id', requireAuth, controller.deleteMedicine);
router.post('/:id/log-dose', requireAuth, controller.logDose);
router.get('/:id/logs', requireAuth, controller.getDoseLogs);

module.exports = router;