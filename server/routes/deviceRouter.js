const router = require('express').Router();
const deviceController = require('../controllers/deviceController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', authMiddleware, checkRole('ADMIN'), deviceController.create);

router.get('/', deviceController.getAll);
router.get('/:id', deviceController.getOne);
router.post('/:id/rating', authMiddleware, deviceController.addRating);

module.exports = router;