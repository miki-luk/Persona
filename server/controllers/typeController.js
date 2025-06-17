// --- START OF FILE typeController.js ---

const { Type, Device } = require('../models/models');
const ApiError = require('../error/ApiError');

class TypeController {
    // --- ↓↓↓ НЕДОСТАЮЩИЙ МЕТОД ↓↓↓ ---
    async create(req, res, next) {
        try {
            const { name } = req.body;
            if (!name) {
                return next(ApiError.badRequest('Не указано имя типа'));
            }
            const type = await Type.create({ name });
            return res.json(type);
        } catch (e) {
            // Обработка ошибки, если тип с таким именем уже существует
            if (e.name === 'SequelizeUniqueConstraintError') {
                return next(ApiError.badRequest('Тип с таким названием уже существует.'));
            }
            return next(ApiError.internal('Ошибка при создании типа: ' + e.message));
        }
    }
    // --- ↑↑↑ КОНЕЦ НЕДОСТАЮЩЕГО МЕТОДА ↑↑↑ ---

    async getAll(req, res, next) {
        try {
            const { departmentId } = req.query;
            let types;

            if (departmentId) {
                // Если указан отдел, ищем только те типы, которые есть у товаров в этом отделе
                types = await Type.findAll({
                    include: [{
                        model: Device,
                        where: { departmentId },
                        attributes: [] // не включаем данные о девайсах, только используем для фильтрации
                    }],
                    group: ['type.id'], // Группируем, чтобы избежать дубликатов типов
                    order: [['name', 'ASC']]
                });
            } else {
                // Если отдел не указан, возвращаем все типы
                types = await Type.findAll({order: [['name', 'ASC']]});
            }
            
            return res.json(types);
        } catch (e) {
            return next(ApiError.internal('Ошибка при получении типов: ' + e.message));
        }
    }
}

module.exports = new TypeController();