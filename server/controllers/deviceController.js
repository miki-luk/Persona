// --- START OF FILE server/controllers/deviceController.js ---

const uuid = require('uuid');
const path = require('path');
const { Device, DeviceInfo, Rating, User, Brand } = require('../models/models'); // <-- Добавьте Brand в импорт
const ApiError = require('../error/ApiError');
const sequelize = require('../db');
const { Op } = require('sequelize');

class DeviceController {
    async create(req, res, next) {
        const t = await sequelize.transaction();
        try {
            // Добавляем departmentId
            let { name, price, brandId, typeId, departmentId, info } = req.body;
            
            const { img } = req.files;
            const allImages = Array.isArray(img) ? img : [img];

            if (allImages.length === 0) {
                return next(ApiError.badRequest('Необходимо загрузить хотя бы одно изображение.'));
            }

            const mainImage = allImages[0];
            const mainImageName = uuid.v4() + ".jpg";
            mainImage.mv(path.resolve(__dirname, '..', 'static', mainImageName));

            // Добавляем departmentId при создании
            const device = await Device.create({ name, price, brandId, typeId, departmentId, img: mainImageName }, { transaction: t });

            if (allImages.length > 1) {
                const additionalImages = allImages.slice(1);
                for (const imageFile of additionalImages) {
                    const fileName = uuid.v4() + ".jpg";
                    imageFile.mv(path.resolve(__dirname, '..', 'static', fileName));
                    await DeviceInfo.create({
                        title: 'image',
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
        // Добавляем departmentId
        let { brandId, typeId, departmentId, limit, page, name } = req.query;
        page = page || 1;
        limit = limit || 12;
        let offset = page * limit - limit;
        
        let where = {};
        if (brandId) where.brandId = brandId;
        if (typeId) where.typeId = typeId;
        if (departmentId) where.departmentId = departmentId; // <-- Новая фильтрация
        if (name) {
            where.name = { [Op.iLike]: `%${name}%` }; 
        }

        const devices = await Device.findAndCountAll({ where, limit, offset });
        
        return res.json(devices);
    }

    // --- ↓↓↓ ИЗМЕНЕНИЯ ЗДЕСЬ ↓↓↓ ---
    async getOne(req, res) {
        const { id } = req.params;
        const device = await Device.findOne({
            where: { id },
            include: [
                { model: DeviceInfo, as: 'info' },
                {
                    model: Rating,
                    include: [{ model: User, attributes: ['email'] }]
                },
                { model: Brand, attributes: ['name'] } // <-- ДОБАВЛЕНО: загружаем связанную модель Бренда
            ]
        });
        return res.json(device);
    }
    // --- ↑↑↑ КОНЕЦ ИЗМЕНЕНИЙ ↑↑↑ ---

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

            const result = await Rating.findOne({
                where: { deviceId: id },
                attributes: [[sequelize.fn('AVG', sequelize.col('rate')), 'averageRating']],
                raw: true
            });
            const averageRating = result.averageRating ? parseFloat(result.averageRating).toFixed(1) : 0;
            
            await Device.update({ rating: averageRating }, { where: { id } });

            return res.json({ message: 'Отзыв успешно добавлен' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new DeviceController();
// --- END OF FILE server/controllers/deviceController.js ---