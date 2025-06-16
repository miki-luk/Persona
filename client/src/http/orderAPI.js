// --- START OF FILE client/src/http/orderAPI.js ---
import { $authHost } from "./index";

export const createOrder = async (orderData) => {
    const { data } = await $authHost.post('api/order', orderData);
    return data;
}

// --- НОВЫЕ ФУНКЦИИ ---
export const fetchUserOrders = async () => {
    const { data } = await $authHost.get('api/order');
    return data;
}

export const fetchAllOrders = async () => {
    const { data } = await $authHost.get('api/order/all');
    return data;
}
// --- END OF FILE client/src/http/orderAPI.js ---