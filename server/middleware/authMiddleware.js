const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
        return; // Добавим return для надежности
    }
    try {
        // Проверяем наличие заголовка
        if (!req.headers.authorization) {
            return res.status(401).json({ message: "Не авторизован (нет заголовка authorization)" });
        }

        const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
        if (!token) {
            return res.status(401).json({ message: "Не авторизован (нет токена)" });
        }

        // Проверяем SECRET_KEY
        if (!process.env.SECRET_KEY) {
            console.error("КРИТИЧЕСКАЯ ОШИБКА: SECRET_KEY не определен в .env файле!");
            return res.status(500).json({ message: "Внутренняя ошибка сервера" });
        }
        
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (e) {
        // Ловим ошибки от jwt.verify (невалидный токен, истекший срок)
        res.status(401).json({ message: "Не авторизован (ошибка верификации токена)" });
    }
};