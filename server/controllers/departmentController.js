// --- START OF FILE server/controllers/departmentController.js ---

const { Department } = require('../models/models');
const ApiError = require('../error/ApiError');

class DepartmentController {
    // --- ↓↓↓ ИЗМЕНЕНИЯ ЗДЕСЬ ↓↓↓ ---
    async create(req, res, next) { // 1. Добавлен параметр 'next'
        // 2. Добавлен блок try...catch для обработки ошибок
        try {
            const { name } = req.body;
            // 3. Улучшена проверка на пустое имя
            if (!name || !name.trim()) {
                // Теперь 'next' определён и его можно вызывать
                return next(ApiError.badRequest('Не указано имя отдела'));
            }
            const department = await Department.create({ name });
            return res.json(department);
        } catch (e) {
            // 4. Обработка ошибок, включая создание дубликата (если имя уникально в модели)
            if (e.name === 'SequelizeUniqueConstraintError') {
                return next(ApiError.badRequest('Отдел с таким названием уже существует.'));
            }
            return next(ApiError.internal('Ошибка при создании отдела: ' + e.message));
        }
    }

    // --- ↓↓↓ ИЗМЕНЕНИЯ ЗДЕСЬ ↓↓↓ ---
    async getAll(req, res, next) { // 1. Добавлен параметр 'next' для единообразия
        // 2. Добавлен блок try...catch
        try {
            const departments = await Department.findAll({
                order: [['name', 'ASC']] // 3. Добавлена сортировка для предсказуемого порядка
            });
            return res.json(departments);
        } catch(e) {
            return next(ApiError.internal('Ошибка при получении отделов: ' + e.message));
        }
    }
}

module.exports = new DepartmentController();
// --- END OF FILE server/controllers/departmentController.js ---