// --- START OF FILE server/controllers/orderController.js ---
const { Order, OrderDevice, Basket, BasketDevice, Device, User } = require('../models/models');
const ApiError = require('../error/ApiError');
const sequelize = require('../db');

class OrderController {
    async create(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const { contactDetails, shippingAddress, paymentMethod } = req.body;
            const userId = req.user.id;

            // 1. Найти корзину пользователя и убедиться, что она существует
            const basket = await Basket.findOne({
                where: { userId },
                include: [{ model: BasketDevice, as: 'basket_devices', include: [{ model: Device }] }]
            });

            if (!basket || !basket.basket_devices || basket.basket_devices.length === 0) {
                // Если корзины нет или она пуста, откатываем транзакцию и возвращаем ошибку
                await t.rollback();
                return next(ApiError.badRequest('Ваша корзина пуста'));
            }

            // 2. Рассчитать итоговую стоимость на сервере
            const totalPrice = basket.basket_devices.reduce((sum, item) => {
                if (!item.device) {
                    // Если в корзине оказался удаленный товар, выбрасываем ошибку
                    throw new Error(`Товар с ID ${item.deviceId} не найден, но был в корзине.`);
                }
                return sum + item.device.price * item.quantity;
            }, 0);

            // 3. Создать заказ
            const order = await Order.create({
                userId,
                totalPrice,
                contactDetails,
                shippingAddress,
                paymentMethod,
            }, { transaction: t });

            // 4. Перенести товары из корзины в заказ
            const orderItems = basket.basket_devices.map(item => ({
                orderId: order.id,
                deviceId: item.deviceId,
                quantity: item.quantity,
                price: item.device.price, // Фиксируем цену на момент заказа
            }));

            await OrderDevice.bulkCreate(orderItems, { transaction: t });

            // 5. Очистить корзину
            await BasketDevice.destroy({ where: { basketId: basket.id }, transaction: t });
            
            // 6. Подтвердить транзакцию
            await t.commit();

            return res.json(order);
        } catch (e) {
            // Убедимся, что транзакция откатывается при любой ошибке
            if (t.finished !== 'commit' && t.finished !== 'rollback') {
               await t.rollback();
            }
            return next(ApiError.internal('Не удалось создать заказ: ' + e.message));
        }
    }

    // --- Методы getUserOrders и getAllOrders остаются без изменений ---

    async getUserOrders(req, res, next) {
        try {
            const userId = req.user.id;
            const orders = await Order.findAll({
                where: { userId },
                include: [{
                    model: OrderDevice,
                    as: 'items',
                    include: [{ model: Device, attributes: ['name', 'img'] }]
                }],
                order: [['createdAt', 'DESC']]
            });
            return res.json(orders);
        } catch (e) {
            return next(ApiError.internal('Ошибка получения заказов: ' + e.message));
        }
    }

    async getAllOrders(req, res, next) {
        try {
            const orders = await Order.findAll({
                include: [
                    { model: User, attributes: ['email'] },
                    {
                        model: OrderDevice,
                        as: 'items',
                        include: [{ model: Device, attributes: ['name'] }]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
            return res.json(orders);
        } catch (e) {
            return next(ApiError.internal('Ошибка получения всех заказов: ' + e.message));
        }
    }
}

module.exports = new OrderController();
// --- END OF FILE server/controllers/orderController.js ---