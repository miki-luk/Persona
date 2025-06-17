const router = require('express').Router();
const departmentController = require('../controllers/departmentController');
const checkRole = require('../middleware/checkRoleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, checkRole('ADMIN'), departmentController.create);

router.get('/', departmentController.getAll);

module.exports = router;