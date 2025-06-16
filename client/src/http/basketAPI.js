// --- START OF FILE client/src/http/basketAPI.js ---
import { $authHost } from "./index";

export const addToBasket = async (deviceId) => {
    const { data } = await $authHost.post('api/basket', { deviceId });
    return data;
}

export const fetchBasket = async () => {
    const { data } = await $authHost.get('api/basket');
    return data;
}

export const removeFromBasket = async (deviceId) => {
    const { data } = await $authHost.delete(`api/basket/${deviceId}`);
    return data;
}

// --- НОВАЯ ФУНКЦИЯ ---
export const updateDeviceQuantity = async (deviceId, quantity) => {
    const { data } = await $authHost.put('api/basket', { deviceId, quantity });
    return data;
}
// --- END OF FILE client/src/http/basketAPI.js ---