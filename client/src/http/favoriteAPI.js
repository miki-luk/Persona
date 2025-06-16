// --- START OF FILE client/src/http/favoriteAPI.js ---
import { $authHost } from "./index";

// Переключатель: добавляет или удаляет товар из избранного
export const toggleFavorite = async (deviceId) => {
    const { data } = await $authHost.post(`api/favorite/${deviceId}`);
    return data;
}

// Получение всех избранных товаров
export const fetchFavorites = async () => {
    const { data } = await $authHost.get('api/favorite');
    return data;
}
// --- END OF FILE client/src/http/favoriteAPI.js ---