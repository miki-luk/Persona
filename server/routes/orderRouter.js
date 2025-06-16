// --- START OF FILE server/routes/orderRouter.js ---
const router = require('express').Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', authMiddleware, orderController.create);
router.get('/', authMiddleware, orderController.getUserOrders); // Получить заказы текущего юзера
router.get('/all', authMiddleware, checkRole('ADMIN'), orderController.getAllOrders); // Получить все заказы (только для админа)
    
module.exports = router;
// --- END OF FILE server/routes/orderRouter.js ---