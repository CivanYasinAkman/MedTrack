const express = require('express');
const router = express.Router();
const controller = require('../controllers/medicineController');
const requireAuth = require('../middleware/requireAuth');

/**
 * @swagger
 *   /api/categories:
 * get:
 *     summary: Tüm ilaç kategorilerini listeler
 *     description: Giriş yapmış kullanıcının seçebileceği ilaç kategorilerini döndürür.
 *     responses:
 *       200:
 *         description: Kategoriler başarıyla listelendi.
 *       401:
 *         description: Yetkisiz erişim, kullanıcı giriş yapmamış.
 */
router.get('/', requireAuth, controller.getCategories);

module.exports = router;