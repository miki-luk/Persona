// --- START OF FILE server/controllers/deviceController.js ---

// uuid и path больше не нужны
const { Device, DeviceInfo, Rating, User, Brand } = require('../models/models');
const ApiError = require('../error/ApiError');
const sequelize = require('../db');
const { Op } = require('sequelize');

// --- НАЧАЛО БЛОКА CLOUDINARY ---
const cloudinary = require('cloudinary').v2;

// Конфигурируем Cloudinary (он сам возьмет переменные из process.env)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});
// --- КОНЕЦ БЛОКА CLOUDINARY ---


class DeviceController {
    async create(req, res, next) {
        const t = await sequelize.transaction();
        try {
            let { name, price, brandId, typeId, departmentId, info } = req.body;
            
            const { img } = req.files;
            const allImages = Array.isArray(img) ? img : [img];

            if (allImages.length === 0) {
                return next(ApiError.badRequest('Необходимо загрузить хотя бы одно изображение.'));
            }

            // --- НАЧАЛО ИЗМЕНЕННОЙ ЛОГИКИ ЗАГРУЗКИ ---
            // Загружаем главное изображение в Cloudinary
            const mainImageUpload = await cloudinary.uploader.upload(allImages[0].tempFilePath, {
                folder: 'persona_shop' // Имя папки в Cloudinary
            });
            const mainImageUrl = mainImageUpload.secure_url; // Получаем https ссылку

            // Создаем товар с ПОЛНЫМ URL из Cloudinary
            const device = await Device.create({ name, price, brandId, typeId, departmentId, img: mainImageUrl }, { transaction: t });

            // Загружаем дополнительные изображения, если они есть
            if (allImages.length > 1) {
                const additionalImages = allImages.slice(1);
                for (const imageFile of additionalImages) {
                    const additionalImageUpload = await cloudinary.uploader.upload(imageFile.tempFilePath, {
                         folder: 'persona_shop'
                    });
                    // Сохраняем ПОЛНЫЙ URL доп. изображения в DeviceInfo
                    await DeviceInfo.create({
                        title: 'image',
                        description: additionalImageUpload.secure_url,
                        deviceId: device.id
                    }, { transaction: t });
                }
            }
            // --- КОНЕЦ ИЗМЕНЕННОЙ ЛОГИКИ ЗАГРУЗКИ ---

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
        let { brandId, typeId, departmentId, limit, page, name } = req.query;
        page = page || 1;
        limit = limit || 12;
        let offset = page * limit - limit;
        
        let where = {};
        if (brandId) where.brandId = brandId;
        if (typeId) where.typeId = typeId;
        if (departmentId) where.departmentId = departmentId;
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
                },
                { model: Brand, attributes: ['name'] }
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