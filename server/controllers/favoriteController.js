// --- START OF FILE server/controllers/favoriteController.js ---
const { FavoriteDevice, Device } = require('../models/models');
const ApiError = require('../error/ApiError');

class FavoriteController {
    // Добавление/удаление из избранного (toggle)
    async toggleFavorite(req, res, next) {
        try {
            const { deviceId } = req.params;
            const userId = req.user.id;

            const existing = await FavoriteDevice.findOne({ where: { deviceId, userId } });

            if (existing) {
                // Если уже в избранном - удаляем
                await existing.destroy();
                return res.json({ message: 'Товар удален из избранного', removed: true });
            } else {
                // Если нет - добавляем
                const favorite = await FavoriteDevice.create({ deviceId, userId });
                // Возвращаем сам объект, чтобы клиент мог его использовать
                const favoriteDevice = await FavoriteDevice.findOne({
                    where: { id: favorite.id },
                    include: [{ model: Device }]
                });
                return res.json({ message: 'Товар добавлен в избранное', favorite: favoriteDevice, added: true });
            }
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Получение всех избранных товаров пользователя
    async getFavorites(req, res) {
        const userId = req.user.id;

        const favorites = await FavoriteDevice.findAll({
            where: { userId },
            include: [{ model: Device }]
        });
        
        // Возвращаем только массив устройств для удобства клиента
        const favoriteDevices = favorites.map(f => f.device).filter(d => d !== null);

        return res.json(favoriteDevices);
    }
}

module.exports = new FavoriteController();
// --- END OF FILE server/controllers/favoriteController.js ---