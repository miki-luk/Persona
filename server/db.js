// server/db.js

const { Sequelize } = require('sequelize');

let sequelize;

// Проверяем, есть ли переменная DATABASE_URL (для хостинга)
if (process.env.DATABASE_URL) {
  // Конфигурация для продакшена (Neon, Render и т.д.)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        // Для Neon и других хостингов с доверенными сертификатами эта опция не нужна.
        // Но ее наличие не помешает и сделает код более универсальным.
        // Если будут проблемы с подключением, можно будет ее раскомментировать.
        // rejectUnauthorized: false 
      },
    },
  });
} else {
  // Конфигурация для локальной разработки
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    }
  );
}

module.exports = sequelize;