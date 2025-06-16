// --- START OF FILE server/controllers/deviceController.js ---
const uuid = require('uuid');
const path = require('path');
const { Device, DeviceInfo, Rating, User } = require('../models/models');
const ApiError = require('../error/ApiError');
const sequelize = require('../db');
const { Op } = require('sequelize');

class DeviceController {
    async create(req, res, next) {
        const t = await sequelize.transaction();
        try {
            let { name, price, brandId, typeId, info } = req.body;
            
            const { img } = req.files;
            // Убедимся, что img всегда массив для единообразной обработки
            const allImages = Array.isArray(img) ? img : [img];

            if (allImages.length === 0) {
                return next(ApiError.badRequest('Необходимо загрузить хотя бы одно изображение.'));
            }

            // Первое изображение становится главным
            const mainImage = allImages[0];
            const mainImageName = uuid.v4() + ".jpg";
            mainImage.mv(path.resolve(__dirname, '..', 'static', mainImageName));

            const device = await Device.create({ name, price, brandId, typeId, img: mainImageName }, { transaction: t });

            // Остальные изображения (если они есть) сохраняем в DeviceInfo
            if (allImages.length > 1) {
                const additionalImages = allImages.slice(1);
                for (const imageFile of additionalImages) {
                    const fileName = uuid.v4() + ".jpg";
                    imageFile.mv(path.resolve(__dirname, '..', 'static', fileName));
                    await DeviceInfo.create({
                        title: 'image', // Специальный ключ для доп. картинок
                        description: fileName,
                        deviceId: device.id
                    }, { transaction: t });
                }
            }

            if (info) {
                const parsedInfo = JSON.parse(info);
                await Promise.all(parsedInfo.map(i =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    }, { transaction: t })
                ));
            }
            
            await t.commit();
            return res.json(device);
        } catch (e) {
            if (t.finished !== 'commit' && t.finished !== 'rollback') {
               await t.rollback();
            }
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        let { brandId, typeId, limit, page, name } = req.query;
        page = page || 1;
        limit = limit || 9;
        let offset = page * limit - limit;
        
        let where = {};
        if (brandId) where.brandId = brandId;
        if (typeId) where.typeId = typeId;
        if (name) {
            where.name = { [Op.iLike]: `%${name}%` }; 
        }

        const devices = await Device.findAndCountAll({ where, limit, offset });
        
        return res.json(devices);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const device = await Device.findOne({
            where: { id },
            include: [
                { model: DeviceInfo, as: 'info' },
                {
                    model: Rating,
                    include: [{ model: User, attributes: ['email'] }]
                }
            ]
        });
        return res.json(device);
    }

    async addRating(req, res, next) {
        try {
            const { id } = req.params;
            const { rate, review } = req.body;
            const userId = req.user.id;

            const existingRating = await Rating.findOne({ where: { userId, deviceId: id } });
            if (existingRating) {
                return next(ApiError.badRequest('Вы уже оставляли отзыв на этот товар'));
            }

            await Rating.create({ rate, review, userId, deviceId: id });

            const ratings = await Rating.findAll({ where: { deviceId: id } });
            const totalRate = ratings.reduce((sum, r) => sum + r.rate, 0);
            const averageRating = ratings.length > 0 ? totalRate / ratings.length : 0;

            await Device.update({ rating: averageRating }, { where: { id } });

            return res.json({ message: 'Отзыв успешно добавлен' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new DeviceController();
// --- END OF FILE server/controllers/deviceController.js ---