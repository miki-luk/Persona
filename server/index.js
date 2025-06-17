// --- START OF FILE server/index.js ---
require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const router =require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const PORT = process.env.PORT || 5000
const cors = require('cors')
const fileUpload = require('express-fileupload')
const app = express()
const path = require('path') // Этот импорт больше не нужен, но можно оставить

app.use(cors())
app.use(express.json())
// СТРОКА УДАЛЕНА: app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({ useTempFiles: true })) // ИЗМЕНЕНИЕ: добавлена опция для работы с Cloudinary
app.use('/api', router)
// Middleware обработки ошибок должен быть последним
app.use(errorHandler)

const start = async () => {
    try {
        console.log('Подключение к базе данных...');
        await sequelize.authenticate();
        console.log('Подключение к базе данных прошло успешно!');

        console.log('Синхронизация моделей...');
        await sequelize.sync();
        console.log('Синхронизация моделей прошла успешно!');

        app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`))
    } catch (e) {
        console.log('ПРОИЗОШЛА ОШИБКА ПРИ ЗАПУСКЕ СЕРВЕРА:', e) // <-- Более детальный вывод ошибки
    }
}

start()
// --- END OF FILE server/index.js ---