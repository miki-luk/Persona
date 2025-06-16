// server/middleware/checkRoleMiddleware.js - ИСПРАВЛЕНО

// Мы больше не импортируем jwt, так как проверкой токена займется authMiddleware
module.exports = function(role) {
    return function (req, res, next) {
        // Мы предполагаем, что authMiddleware уже отработал
        // и поместил данные пользователя в req.user.
        // Если его не будет, код упадет, что укажет на ошибку в конфигурации роутов.
        
        if (req.user.role !== role) {
            return res.status(403).json({message: "Нет доступа"});
        }
        next();
    };
}