// --- START OF FILE client/src/components/AppRouter.js ---
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from "../routes";
import { SHOP_ROUTE } from "../utils/consts";
import { Context } from "../index";
import { observer } from "mobx-react-lite";

// --- НОВАЯ РЕКУРСИВНАЯ ФУНКЦИЯ ДЛЯ РЕНДЕРА РОУТОВ ---
const renderRoutes = (routes) => {
    return routes.map(({ path, Component, children }) => (
        <Route key={path} path={path} element={<Component />}>
            {children && renderRoutes(children)}
        </Route>
    ));
};

const AppRouter = observer(() => {
    const { user } = useContext(Context);

    return (
        <Routes>
            {user.isAuth && renderRoutes(authRoutes)}
            {renderRoutes(publicRoutes)}
            <Route path="*" element={<Navigate to={SHOP_ROUTE} replace />} />
        </Routes>
    );
});

export default AppRouter;
// --- END OF FILE client/src/components/AppRouter.js ---