// --- START OF FILE client/src/App.js ---
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";
import { Spinner } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { fetchBasket } from "./http/basketAPI";
import { fetchFavorites } from "./http/favoriteAPI";
import './App.css';

const App = observer(() => {
    const { user, basket, favorite } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Проверяем токен при загрузке приложения
        check().then(data => {
            user.setUser(data);
            user.setIsAuth(true);
            // Если пользователь авторизован, загружаем его данные
            return Promise.all([
                fetchBasket(),
                fetchFavorites()
            ]);
        }).then(([basketData, favoritesData]) => {
            if (basketData && basketData.basket_devices) {
                basket.setBasketDevices(basketData.basket_devices);
            }
            if (favoritesData) {
                favorite.setFavorites(favoritesData);
            }
        }).catch(err => {
            // Ошибка авторизации - это нормально, просто выводим в консоль
            console.log(err.message);
        }).finally(() => {
            // В любом случае убираем загрузку
            setLoading(false);
        });
    }, [user]); // Добавляем user в зависимости, чтобы при логине/логауте данные обновлялись

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner animation={"grow"} />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Header />
            <main className="app-content">
                <AppRouter />
            </main>
            <Footer />
        </BrowserRouter>
    );
});

export default App;
// --- END OF FILE client/src/App.js ---