const router = require('express').Router();
const brandController = require('../controllers/brandController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', authMiddleware, checkRole('ADMIN'), brandController.create);

router.get('/', brandController.getAll);

module.exports = router;