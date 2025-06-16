// --- START OF FILE server/controllers/userController.js ---
const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')
const sequelize = require('../db'); // 

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        // --- Оборачиваем весь процесс в транзакцию ---
        const t = await sequelize.transaction();
        try {
            const {email, password} = req.body;
            if (!email || !password) {
                await t.rollback();
                return next(ApiError.badRequest('Некорректный email или password'))
            }
            const candidate = await User.findOne({where: {email}, transaction: t});
            if (candidate) {
                await t.rollback();
                return next(ApiError.badRequest('Пользователь с таким email уже существует'))
            }
            const hashPassword = await bcrypt.hash(password, 10);

            // Создаем пользователя в рамках транзакции
            const user = await User.create({email, password: hashPassword}, {transaction: t});
            
            // Создаем корзину для него в рамках той же транзакции
            await Basket.create({userId: user.id}, {transaction: t});
            
            const token = generateJwt(user.id, user.email, user.role);

            // Если все прошло успешно, подтверждаем транзакцию
            await t.commit();
            
            return res.json({token});
        } catch (e) {
            // Если на любом этапе произошла ошибка, откатываем все изменения
            await t.rollback();
            return next(ApiError.internal('Ошибка при регистрации: ' + e.message));
        }
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.badRequest('Пользователь с таким email не найден'))
        }
        let comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return next(ApiError.badRequest('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController()
// --- END OF FILE server/controllers/userController.js ---