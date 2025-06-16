// --- START OF FILE server/models/models.js ---
const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', { id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, email: {type: DataTypes.STRING, unique: true,}, password: {type: DataTypes.STRING}, role: {type: DataTypes.STRING, defaultValue: "USER"}, })
const Basket = sequelize.define('basket', { id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, })
const BasketDevice = sequelize.define('basket_device', { id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, quantity: { type: DataTypes.INTEGER, defaultValue: 1 }, })
const Device = sequelize.define('device', { id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, name: {type: DataTypes.STRING, unique: true, allowNull: false}, price: {type: DataTypes.INTEGER, allowNull: false}, rating: {type: DataTypes.INTEGER, defaultValue: 0}, img: {type: DataTypes.STRING, allowNull: false}, })
const Type = sequelize.define('type', { id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, name: {type: DataTypes.STRING, unique: true, allowNull: false}, })
const Brand = sequelize.define('brand', { id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, name: {type: DataTypes.STRING, unique: true, allowNull: false}, })
const Rating = sequelize.define('rating', { id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, rate: {type: DataTypes.INTEGER, allowNull: false}, review: {type: DataTypes.STRING, allowNull: true}, })
const DeviceInfo = sequelize.define('device_info', { id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, title: {type: DataTypes.STRING, allowNull: false}, description: {type: DataTypes.STRING, allowNull: false}, })
const TypeBrand = sequelize.define('type_brand', { id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, })
const FavoriteDevice = sequelize.define('favorite_device', { id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, });
const Order = sequelize.define('order', { id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, status: {type: DataTypes.STRING, defaultValue: 'В обработке'}, totalPrice: {type: DataTypes.INTEGER, allowNull: false}, contactDetails: {type: DataTypes.JSONB, allowNull: false}, shippingAddress: {type: DataTypes.JSONB, allowNull: false}, paymentMethod: {type: DataTypes.STRING, allowNull: false}, });
const OrderDevice = sequelize.define('order_device', { id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, quantity: {type: DataTypes.INTEGER, allowNull: false}, price: {type: DataTypes.INTEGER, allowNull: false} });

User.hasOne(Basket);
Basket.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

Basket.hasMany(BasketDevice, {as: 'basket_devices'});
BasketDevice.belongsTo(Basket);

Type.hasMany(Device);
Device.belongsTo(Type);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Device.hasMany(Rating);
Rating.belongsTo(Device);

Device.hasMany(BasketDevice);
BasketDevice.belongsTo(Device);

Device.hasMany(DeviceInfo, {as: 'info'});
DeviceInfo.belongsTo(Device);

Type.belongsToMany(Brand, {through: TypeBrand });
Brand.belongsToMany(Type, {through: TypeBrand });

User.hasMany(FavoriteDevice);
FavoriteDevice.belongsTo(User);

Device.hasMany(FavoriteDevice);
FavoriteDevice.belongsTo(Device);

User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderDevice, {as: 'items'});
OrderDevice.belongsTo(Order);

Device.hasMany(OrderDevice);
OrderDevice.belongsTo(Device);

module.exports = { User, Basket, BasketDevice, Device, Type, Brand, Rating, TypeBrand, DeviceInfo, FavoriteDevice, Order, OrderDevice };
// --- END OF FILE server/models/models.js ---