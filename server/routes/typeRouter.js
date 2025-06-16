// server/routes/typeRouter.js

const router = require('express').Router();
const typeController = require('../controllers/typeController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', authMiddleware, checkRole('ADMIN'), typeController.create);

router.get('/', typeController.getAll);

module.exports = router;