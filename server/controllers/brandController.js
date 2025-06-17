// --- START OF FILE brandController.js ---

const { Brand, Device } = require('../models/models');
const ApiError = require('../error/ApiError');

class BrandController {
    // --- ↓↓↓ НЕДОСТАЮЩИЙ МЕТОД ↓↓↓ ---
    async create(req, res, next) {
        try {
            const { name } = req.body;
            if (!name) {
                return next(ApiError.badRequest('Не указано имя бренда'));
            }
            const brand = await Brand.create({ name });
            return res.json(brand);
        } catch (e) {
            // Обработка ошибки, если бренд с таким именем уже существует (из-за unique:true в модели)
            if (e.name === 'SequelizeUniqueConstraintError') {
                return next(ApiError.badRequest('Бренд с таким названием уже существует.'));
            }
            return next(ApiError.internal('Ошибка при создании бренда: ' + e.message));
        }
    }
    // --- ↑↑↑ КОНЕЦ НЕДОСТАЮЩЕГО МЕТОДА ↑↑↑ ---

    async getAll(req, res, next) {
        try {
            const { departmentId } = req.query;
            let brands;

            if (departmentId) {
                // Аналогично ищем бренды, которые есть у товаров в указанном отделе
                brands = await Brand.findAll({
                    include: [{
                        model: Device,
                        where: { departmentId },
                        attributes: []
                    }],
                    group: ['brand.id'],
                    order: [['name', 'ASC']]
                });
            } else {
                brands = await Brand.findAll({order: [['name', 'ASC']]});
            }

            return res.json(brands);
        } catch (e) {
            return next(ApiError.internal('Ошибка при получении брендов: ' + e.message));
        }
    }
}

module.exports = new BrandController();