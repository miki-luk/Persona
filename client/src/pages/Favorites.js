// --- START OF FILE client/src/pages/Favorites.js ---
import React, { useContext } from 'react';
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import { Container, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { SHOP_ROUTE } from "../utils/consts";
import DeviceItem from '../components/DeviceItem';

const Favorites = observer(() => {
    const { favorite } = useContext(Context);
    const navigate = useNavigate();

    if (favorite.favoriteCount === 0) {
        return (
            <Container className="d-flex flex-column align-items-center justify-content-center" style={{height: '70vh'}}>
                <h2>В избранном пусто</h2>
                <p className="text-muted">Добавляйте товары, нажимая на сердечко</p>
                <Button variant="dark" onClick={() => navigate(SHOP_ROUTE)}>Перейти в каталог</Button>
            </Container>
        )
    }

    return (
        <Container className="mt-5">
            <h1 className="mb-4">Избранные товары</h1>
            <Row>
                {favorite.favorites.map(device =>
                    device ? <DeviceItem key={device.id} device={device} /> : null
                )}
            </Row>
        </Container>
    );
});

export default Favorites;
// --- END OF FILE client/src/pages/Favorites.js ---