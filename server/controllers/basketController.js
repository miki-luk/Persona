// --- START OF FILE server/controllers/basketController.js ---
const { BasketDevice, Device, Basket } = require('../models/models');
const ApiError = require('../error/ApiError');

class BasketController {
    async addDevice(req, res, next) {
        try {
            const { deviceId } = req.body;
            const basket = await Basket.findOne({ where: { userId: req.user.id } });
            const candidate = await BasketDevice.findOne({ where: { basketId: basket.id, deviceId } });
            let basketDevice;
            if (candidate) {
                candidate.quantity += 1;
                await candidate.save();
                basketDevice = candidate;
            } else {
                basketDevice = await BasketDevice.create({ basketId: basket.id, deviceId });
            }
            const result = await BasketDevice.findOne({ where: { id: basketDevice.id }, include: [{ model: Device }] });
            return res.json(result);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async updateQuantity(req, res, next) {
        try {
            const { deviceId, quantity } = req.body;
            const basket = await Basket.findOne({ where: { userId: req.user.id } });
            if (quantity < 1) { return next(ApiError.badRequest('Количество не может быть меньше 1')); }
            await BasketDevice.update({ quantity }, { where: { basketId: basket.id, deviceId } });
            return res.json({ message: 'Количество обновлено' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getBasket(req, res, next) {
        try {
            const { id } = req.user;
            const basket = await Basket.findOne({
                where: { userId: id },
                include: [{
                    model: BasketDevice,
                    as: 'basket_devices', // <-- ИСПОЛЬЗУЕМ АЛИАС
                    include: [{ model: Device }]
                }],
                order: [
                    [{ model: BasketDevice, as: 'basket_devices' }, 'id', 'ASC'] // <-- ИСПОЛЬЗУЕМ АЛИАС
                ]
            });
            if (!basket) { return res.json({ id: null, userId: id, basket_devices: [] }); }
            return res.json(basket);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }
    async removeDevice(req, res, next) {
        try {
            const { deviceId } = req.params;
            const basket = await Basket.findOne({ where: { userId: req.user.id } });
            if (!basket) { return next(ApiError.badRequest('Корзина не найдена')); }
            await BasketDevice.destroy({ where: { basketId: basket.id, deviceId: Number(deviceId) } });
            return res.json({ message: 'Товар удален из корзины' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}
module.exports = new BasketController();
// --- END OF FILE server/controllers/basketController.js ---