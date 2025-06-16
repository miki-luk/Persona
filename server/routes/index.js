// --- START OF FILE server/routes/index.js ---
const router = require('express').Router();
const orderRouter = require('./orderRouter');
const deviceRouter = require('./deviceRouter');
const userRouter = require('./userRouter');
const brandRouter = require('./brandRouter');
const typeRouter = require('./typeRouter');
const basketRouter = require('./basketRouter');
const favoriteRouter = require('./favoriteRouter'); // <-- ИМПОРТ

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/brand', brandRouter);
router.use('/device', deviceRouter);
router.use('/basket', basketRouter);
router.use('/favorite', favoriteRouter); // <-- РЕГИСТРАЦИЯ
router.use('/favorite', favoriteRouter);
router.use('/order', orderRouter);
module.exports = router;
// --- END OF FILE server/routes/index.js ---