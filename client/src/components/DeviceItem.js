// --- START OF FILE client/src/components/DeviceItem.js ---
import React, { useContext } from 'react';
import { Card, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { addToBasket } from "../http/basketAPI";
import { toggleFavorite } from "../http/favoriteAPI";
import { BagPlus, Heart, HeartFill } from 'react-bootstrap-icons';

const DeviceItem = observer(({ device }) => {
    const navigate = useNavigate();
    const { user, basket, favorite } = useContext(Context);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (!user.isAuth) {
            alert('Чтобы добавить товар в корзину, необходимо авторизоваться.');
            return;
        }
        addToBasket(device.id).then((newItem) => {
            basket.addDevice(newItem);
            alert(`Товар "${device.name}" добавлен в корзину!`);
        }).catch(error => {
            alert(error.response?.data?.message || 'Ошибка добавления товара');
        });
    };

    const handleToggleFavorite = (e) => {
        e.stopPropagation();
        if (!user.isAuth) {
            alert('Чтобы добавить в избранное, необходимо авторизоваться.');
            return;
        }
        
        toggleFavorite(device.id).then(data => {
            if (data.added) {
                favorite.addFavorite(device);
            } else if (data.removed) {
                favorite.removeFavorite(device.id);
            }
        });
    };

    const isFavorite = favorite.isFavorite(device.id);

    return (
        <Col lg={3} md={4} sm={6} className="mb-4">
            <Card className="product-card h-100">
                <div style={{cursor: 'pointer'}} onClick={() => navigate(DEVICE_ROUTE + '/' + device.id)}>
                    <div className="card-img-container">
                        <Card.Img
                            variant="top"
                            className="card-img-top"
                            src={device.img}
                        />
                    </div>
                    <Card.Body>
                        <Card.Title>{device.name}</Card.Title>
                        <div className="product-price">
                            {new Intl.NumberFormat('ru-RU').format(device.price)} ₽
                        </div>
                    </Card.Body>
                </div>

                <Card.Footer className="product-card-footer">
                    {isFavorite ? (
                        <HeartFill className="footer-icon-active" onClick={handleToggleFavorite} />
                    ) : (
                        <Heart className="footer-icon" onClick={handleToggleFavorite} />
                    )}
                    <BagPlus className="footer-icon" onClick={handleAddToCart} />
                </Card.Footer>
            </Card>
        </Col>
    );
});

export default DeviceItem;
// --- END OF FILE client/src/components/DeviceItem.js ---