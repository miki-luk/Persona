const router = require('express').Router();
const orderRouter = require('./orderRouter');
const deviceRouter = require('./deviceRouter');
const userRouter = require('./userRouter');
const brandRouter = require('./brandRouter');
const typeRouter = require('./typeRouter');
const basketRouter = require('./basketRouter');
const favoriteRouter = require('./favoriteRouter');
const departmentRouter = require('./departmentRouter'); // <-- ИМПОРТ

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/brand', brandRouter);
router.use('/device', deviceRouter);
router.use('/basket', basketRouter);
router.use('/favorite', favoriteRouter);
router.use('/order', orderRouter);
router.use('/department', departmentRouter); // <-- РЕГИСТРАЦИЯ

module.exports = router;