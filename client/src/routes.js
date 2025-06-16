// --- START OF FILE client/src/routes.js ---
import Admin from "./pages/Admin";
import Basket from "./pages/Basket";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import DevicePage from "./pages/DevicePage";
import Favorites from "./pages/Favorites";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
// --- Новые импорты ---
import OrderHistory from "./components/account/OrderHistory";
import UserProfile from "./components/account/UserProfile";
// --------------------
import { ADMIN_ROUTE, BASKET_ROUTE, DEVICE_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, FAVORITES_ROUTE, CHECKOUT_ROUTE, ACCOUNT_ROUTE } from "./utils/consts";

export const authRoutes = [
    { path: ADMIN_ROUTE, Component: Admin },
    { path: BASKET_ROUTE, Component: Basket },
    { path: FAVORITES_ROUTE, Component: Favorites },
    { path: CHECKOUT_ROUTE, Component: Checkout },
    // --- ИЗМЕНЯЕМ РОУТ ДЛЯ ЛИЧНОГО КАБИНЕТА ---
    { 
        path: ACCOUNT_ROUTE, 
        Component: Account,
        children: [
            { path: '', Component: OrderHistory }, // По умолчанию
            { path: 'profile', Component: UserProfile },
        ]
    },
];

// Маршруты, доступные всем
export const publicRoutes = [
    { path: SHOP_ROUTE, Component: Shop },
    { path: LOGIN_ROUTE, Component: Auth },
    { path: REGISTRATION_ROUTE, Component: Auth },
    { path: DEVICE_ROUTE + '/:id', Component: DevicePage },
];
// --- END OF FILE client/src/routes.js ---