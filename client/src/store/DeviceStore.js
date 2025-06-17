import { makeAutoObservable } from "mobx";

export default class DeviceStore {
    constructor() {
        this._departments = [];
        this._types = [];
        this._brands = [];
        this._devices = [];
        this._selectedDepartment = {};
        this._selectedType = {};
        this._selectedBrand = {};
        this._searchQuery = "";
        this._page = 1;
        this._totalCount = 0;
        this._limit = 12;
        makeAutoObservable(this);
    }

    setDepartments(departments) { this._departments = departments; }
    setTypes(types) { this._types = types; }
    setBrands(brands) { this._brands = brands; }
    setDevices(devices) { this._devices = devices; }

    setSelectedDepartment(department) {
        if (this._selectedDepartment.id !== department.id) {
            this.setPage(1);
            this.setSelectedType({});
            this.setSelectedBrand({});
            this.setSearchQuery("");
            this._selectedDepartment = department || {};
            this._types = [];
            this._brands = [];
        }
    }
    
    setSelectedType(type) {
        this.setPage(1);
        this._selectedType = type || {};
    }

    setSelectedBrand(brand) {
        this.setPage(1);
        this._selectedBrand = brand || {};
    }

    setPage(page) { this._page = page; }
    setTotalCount(count) { this._totalCount = count; }
    
    setSearchQuery(query) {
        this.setPage(1);
        this._searchQuery = query;
    }

    get departments() { return this._departments; }
    get types() { return this._types; }
    get brands() { return this._brands; }
    get devices() { return this._devices; }
    get selectedDepartment() { return this._selectedDepartment; }
    get selectedType() { return this._selectedType; }
    get selectedBrand() { return this._selectedBrand; }
    get totalCount() { return this._totalCount; }
    get page() { return this._page; }
    get limit() { return this._limit; }
    get searchQuery() { return this._searchQuery; }
}