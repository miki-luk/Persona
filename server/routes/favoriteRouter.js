// --- START OF FILE server/routes/favoriteRouter.js ---
const router = require('express').Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

// Все действия с избранным только для авторизованных пользователей
router.get('/', authMiddleware, favoriteController.getFavorites);
router.post('/:deviceId', authMiddleware, favoriteController.toggleFavorite);

module.exports = router;
// --- END OF FILE server/routes/favoriteRouter.js ---