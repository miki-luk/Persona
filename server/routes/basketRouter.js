// --- START OF FILE server/routes/basketRouter.js ---
const router = require('express').Router();
const basketController = require('../controllers/basketController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, basketController.getBasket);
router.post('/', authMiddleware, basketController.addDevice);
router.put('/', authMiddleware, basketController.updateQuantity); // <-- НОВЫЙ МАРШРУТ
router.delete('/:deviceId', authMiddleware, basketController.removeDevice);

module.exports = router;
// --- END OF FILE server/routes/basketRouter.js ---