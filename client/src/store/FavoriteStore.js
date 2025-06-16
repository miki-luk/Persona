// --- START OF FILE client/src/store/FavoriteStore.js ---
import { makeAutoObservable } from "mobx";

export default class FavoriteStore {
    constructor() {
        this._favorites = [];
        this._favoriteIds = new Set(); // Для быстрой проверки O(1)
        makeAutoObservable(this);
    }

    setFavorites(devices) {
        this._favorites = devices;
        this._favoriteIds.clear();
        devices.forEach(d => this._favoriteIds.add(d.id));
    }

    addFavorite(device) {
        // Проверяем, чтобы не добавить дубликат
        if (!this._favoriteIds.has(device.id)) {
            this._favorites.push(device);
            this._favoriteIds.add(device.id);
        }
    }

    removeFavorite(deviceId) {
        this._favorites = this._favorites.filter(d => d.id !== deviceId);
        this._favoriteIds.delete(deviceId);
    }

    isFavorite(deviceId) {
        return this._favoriteIds.has(deviceId);
    }

    get favorites() {
        return this._favorites;
    }
    
    get favoriteCount() {
        return this._favorites.length;
    }
}
// --- END OF FILE client/src/store/FavoriteStore.js ---