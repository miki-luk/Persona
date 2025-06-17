import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";
import { Spinner } from "react-bootstrap";
import Header from "./components/Header";
import DepartmentNav from "./components/DepartmentNav";
import Footer from "./components/Footer";
import { fetchBasket } from "./http/basketAPI";
import { fetchFavorites } from "./http/favoriteAPI";
import './App.css';

const App = observer(() => {
    const { user, basket, favorite } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("App.js: useEffect запущен");

        const token = localStorage.getItem('token');
        if (!token) {
            console.log("App.js: Токен не найден, завершаем загрузку.");
            setLoading(false);
            return;
        }

        console.log("App.js: Токен найден, отправляем запрос check().");
        check().then(data => {
            console.log("App.js: Успешный ответ от check()", data);
            user.setUser(data);
            user.setIsAuth(true);
            
            console.log("App.js: Загружаем корзину и избранное.");
            return Promise.all([
                fetchBasket().catch(e => { console.error("Ошибка загрузки корзины:", e); return null; }),
                fetchFavorites().catch(e => { console.error("Ошибка загрузки избранного:", e); return null; })
            ]);
        }).then(([basketData, favoritesData]) => {
            console.log("App.js: Получены данные корзины и избранного.");
            if (basketData && basketData.basket_devices) {
                basket.setBasketDevices(basketData.basket_devices);
                console.log("App.js: Корзина установлена в стор.");
            }
            if (favoritesData) {
                favorite.setFavorites(favoritesData);
                console.log("App.js: Избранное установлено в стор.");
            }
        }).catch(err => {
            console.error("App.js: Произошла ошибка в цепочке .then(): ", err.response?.data?.message || err.message);
            // Если ошибка авторизации (например, токен истек), просто выходим, пользователь не авторизован
            localStorage.removeItem('token');
            user.setIsAuth(false);
            user.setUser({});
        }).finally(() => {
            console.log("App.js: Блок finally, завершаем загрузку.");
            setLoading(false);
        });
    }, [user, basket, favorite]); // Оставляем зависимости, чтобы mobx мог отслеживать

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner animation={"border"} />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Header />
            <DepartmentNav />
            <main className="app-content">
                <AppRouter />
            </main>
            <Footer />
        </BrowserRouter>
    );
});

export default App;