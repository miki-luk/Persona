// --- START OF FILE client/src/index.js ---
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from "./store/UserStore";
import DeviceStore from "./store/DeviceStore";
import BasketStore from "./store/BasketStore";
import FavoriteStore from "./store/FavoriteStore"; // <-- ИМПОРТ

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new UserStore(),
        device: new DeviceStore(),
        basket: new BasketStore(),
        favorite: new FavoriteStore(), // <-- ДОБАВИТЬ
    }}>
        <App />
    </Context.Provider>
);
// --- END OF FILE client/src/index.js ---