// --- START OF FILE client/src/pages/Basket.js ---
import React, { useContext, useState } from 'react';
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import { Container, Row, Col, Card, Button, Image, Form } from "react-bootstrap";
import { removeFromBasket, updateDeviceQuantity } from "../http/basketAPI";
import { useNavigate } from "react-router-dom";
import { SHOP_ROUTE, CHECKOUT_ROUTE } from "../utils/consts";

const Basket = observer(() => {
    const { basket } = useContext(Context);
    const navigate = useNavigate();
    const [debounceTimers, setDebounceTimers] = useState({});

    const handleRemove = (deviceId) => {
        removeFromBasket(deviceId).then(() => {
            basket.removeDevice(deviceId);
        });
    };

    const handleQuantityChange = (deviceId, quantity) => {
        const newQuantity = Math.max(1, Number(quantity));
        basket.updateDeviceQuantity(deviceId, newQuantity);
        if (debounceTimers[deviceId]) { clearTimeout(debounceTimers[deviceId]); }
        const timer = setTimeout(() => {
            updateDeviceQuantity(deviceId, newQuantity).catch(e => alert(e.response?.data?.message || 'Ошибка обновления'));
        }, 700);
        setDebounceTimers(prev => ({...prev, [deviceId]: timer}));
    };

    const handleOrder = () => {
        navigate(CHECKOUT_ROUTE);
    };

    if (basket.uniqueItemsCount === 0) {
        return (
            <Container className="d-flex flex-column align-items-center justify-content-center" style={{height: '70vh'}}>
                <h2>Ваша корзина пуста</h2>
                <p className="text-muted">Самое время отправиться за покупками!</p>
                <Button variant="dark" onClick={() => navigate(SHOP_ROUTE)}>Перейти в каталог</Button>
            </Container>
        )
    }

    return (
        <Container className="mt-5">
            <h1 className="mb-4">Корзина</h1>
            <Row>
                <Col md={8}>
                    {basket.basketDevices.map(item =>
                        item.device && (
                            <Card key={item.id} className="mb-3 d-flex flex-row p-3 align-items-center">
                                <Image src={item.device.img} style={{ width: 100, height: 100, objectFit: 'contain' }} alt={item.device.name} />
                                <div className="ms-4 flex-grow-1">
                                    <h5>{item.device.name}</h5>
                                    <div style={{fontWeight: 600}}>{new Intl.NumberFormat('ru-RU').format(item.device.price)} руб.</div>
                                </div>
                                <Form.Control
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.deviceId, e.target.value)}
                                    style={{ width: '80px', textAlign: 'center' }}
                                    className="mx-4"
                                    min={1}
                                />
                                <Button variant="outline-danger" onClick={() => handleRemove(item.device.id)}>Удалить</Button>
                            </Card>
                        )
                    )}
                </Col>
                <Col md={4}>
                    <Card className="p-4">
                        <h4>Итого</h4>
                        <hr />
                        <div className="d-flex justify-content-between">
                            <span>{basket.totalCount} товар(а)</span>
                            <span>{new Intl.NumberFormat('ru-RU').format(basket.totalPrice)} руб.</span>
                        </div>
                        <Button variant="dark" className="mt-4 w-100" onClick={handleOrder}>
                            Оформить заказ
                        </Button>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
});

export default Basket;
// --- END OF FILE client/src/pages/Basket.js ---