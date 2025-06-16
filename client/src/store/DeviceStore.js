// client/src/store/DeviceStore.js

import { makeAutoObservable } from "mobx";

export default class DeviceStore {
    constructor() {
        this._types = [];
        this._brands = [];
        this._devices = [];
        this._selectedType = {};
        this._selectedBrand = {};
        this._searchQuery = ""; // Свойство для хранения поискового запроса
        this._page = 1;
        this._totalCount = 0;
        this._limit = 9; // Лимит товаров на странице
        makeAutoObservable(this);
    }

    // --- Сеттеры (методы для изменения состояния) ---

    setTypes(types) {
        this._types = types;
    }

    setBrands(brands) {
        this._brands = brands;
    }

    setDevices(devices) {
        this._devices = devices;
    }

    setSelectedType(type) {
        this.setPage(1); // Сбрасываем страницу при смене типа
        this._selectedType = type || {};
    }

    setSelectedBrand(brand) {
        this.setPage(1); // Сбрасываем страницу при смене бренда
        this._selectedBrand = brand || {};
    }

    setPage(page) {
        this._page = page;
    }

    setTotalCount(count) {
        this._totalCount = count;
    }

    // --- НЕДОСТАЮЩИЙ МЕТОД, КОТОРЫЙ МЫ ДОБАВЛЯЕМ ---
    setSearchQuery(query) {
        this.setPage(1); // Сбрасываем на первую страницу при новом поиске
        this._searchQuery = query;
    }

    // --- Геттеры (методы для получения состояния) ---

    get types() {
        return this._types;
    }

    get brands() {
        return this._brands;
    }

    get devices() {
        return this._devices;
    }

    get selectedType() {
        return this._selectedType;
    }

    get selectedBrand() {
        return this._selectedBrand;
    }

    get totalCount() {
        return this._totalCount;
    }

    get page() {
        return this._page;
    }

    get limit() {
        return this._limit;
    }

    // --- НЕДОСТАЮЩИЙ ГЕТТЕР, КОТОРЫЙ МЫ ДОБАВЛЯЕМ ---
    get searchQuery() {
        return this._searchQuery;
    }
}