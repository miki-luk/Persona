// server/db.js
const { Sequelize } = require('sequelize');

// Проверяем, есть ли переменная DATABASE_URL (для Render)
if (process.env.DATABASE_URL) {
    // Используем URL для подключения в продакшене
    module.exports = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Это важно для подключения к Render
            }
        }
    });
} else {
    // Оставляем старый способ для локальной разработки
    module.exports = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            dialect: 'postgres',
            host: process.env.DB_HOST,
            port: process.env.DB_PORT
        }
    );
}