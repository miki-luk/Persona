// --- START OF FILE client/src/store/BasketStore.js ---
import { makeAutoObservable } from "mobx";

export default class BasketStore {
    constructor() {
        this._basketDevices = [];
        makeAutoObservable(this);
    }

    setBasketDevices(devices) {
        this._basketDevices = devices.filter(item => item.device !== null);
    }

    addDevice(device) {
        // Проверяем, есть ли уже товар в корзине
        const existingDevice = this._basketDevices.find(item => item.deviceId === device.deviceId);
        if (existingDevice) {
            // Если да, просто увеличиваем количество
            existingDevice.quantity += 1;
        } else {
            // Если нет, добавляем новый элемент
            this._basketDevices.push(device);
        }
    }

    removeDevice(deviceId) {
        this._basketDevices = this._basketDevices.filter(item => item.device && item.device.id !== Number(deviceId));
    }
    
    // --- НОВЫЙ МЕТОД ---
    updateDeviceQuantity(deviceId, quantity) {
        const item = this._basketDevices.find(item => item.deviceId === deviceId);
        if (item) {
            item.quantity = Number(quantity);
        }
    }

    get basketDevices() {
        return this._basketDevices;
    }

    // --- ИЗМЕНЕННАЯ ЛОГИКА ---
    get totalPrice() {
        return this._basketDevices.reduce((sum, item) => {
            return sum + (item.device ? item.device.price * item.quantity : 0);
        }, 0);
    }

    // --- ИЗМЕНЕННАЯ ЛОГИКА ---
    get totalCount() {
        // Теперь это общее количество всех единиц товара
        return this._basketDevices.reduce((sum, item) => sum + item.quantity, 0);
    }

    // --- НОВЫЙ ГЕТТЕР ---
    get uniqueItemsCount() {
        // Количество уникальных позиций
        return this._basketDevices.length;
    }
}
// --- END OF FILE client/src/store/BasketStore.js ---