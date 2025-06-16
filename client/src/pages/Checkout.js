// --- START OF FILE client/src/pages/Checkout.js ---
import React, { useContext, useState } from 'react';
import { Container, Form, Card, Button, Row, Col, Spinner } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { useNavigate } from 'react-router-dom';
import { SHOP_ROUTE } from '../utils/consts';
import { createOrder } from '../http/orderAPI';

const Checkout = observer(() => {
    const { basket, user } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [contactDetails, setContactDetails] = useState({ name: '', phone: '', email: user.user.email });
    const [shippingAddress, setShippingAddress] = useState({ city: '', street: '', house: '', apartment: '' });
    const [paymentMethod, setPaymentMethod] = useState('card_on_delivery');

    const handleInputChange = (setter, field) => (e) => {
        setter(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handlePlaceOrder = async () => {
        // Простая валидация
        if (!contactDetails.name || !contactDetails.phone || !shippingAddress.city || !shippingAddress.street || !shippingAddress.house) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }
        
        setLoading(true);
        try {
            const orderData = {
                contactDetails,
                shippingAddress,
                paymentMethod,
            };

            await createOrder(orderData);
            
            alert('Ваш заказ успешно оформлен!');
            basket.setBasketDevices([]); // Очищаем корзину в сторе
            navigate(SHOP_ROUTE);

        } catch (e) {
            alert(e.response?.data?.message || 'Произошла ошибка при оформлении заказа.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5 mb-5">
            <Row>
                <Col md={8}>
                    <h1>Оформление заказа</h1>
                    <Card className="p-4 mt-3">
                        <Form>
                            <h4>1. Контактные данные</h4>
                            <Form.Group className="mb-3">
                                <Form.Label>ФИО</Form.Label>
                                <Form.Control type="text" placeholder="Иванов Иван Иванович" value={contactDetails.name} onChange={handleInputChange(setContactDetails, 'name')} />
                            </Form.Group>
                             <Form.Group className="mb-3">
                                <Form.Label>Телефон</Form.Label>
                                <Form.Control type="tel" placeholder="+7 (999) 999-99-99" value={contactDetails.phone} onChange={handleInputChange(setContactDetails, 'phone')} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="email@example.com" value={contactDetails.email} onChange={handleInputChange(setContactDetails, 'email')} />
                            </Form.Group>

                            <h4 className="mt-4">2. Адрес доставки</h4>
                            <Form.Group className="mb-3">
                                <Form.Label>Город</Form.Label>
                                <Form.Control type="text" value={shippingAddress.city} onChange={handleInputChange(setShippingAddress, 'city')} />
                            </Form.Group>
                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Улица</Form.Label>
                                        <Form.Control type="text" value={shippingAddress.street} onChange={handleInputChange(setShippingAddress, 'street')} />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Дом</Form.Label>
                                        <Form.Control type="text" value={shippingAddress.house} onChange={handleInputChange(setShippingAddress, 'house')} />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Кв.</Form.Label>
                                        <Form.Control type="text" value={shippingAddress.apartment} onChange={handleInputChange(setShippingAddress, 'apartment')} />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <h4 className="mt-4">3. Способ оплаты</h4>
                            <Form.Group>
                                <Form.Check type="radio" label="Картой при получении" name="paymentMethod" id="card_on_delivery" value="card_on_delivery" checked={paymentMethod === 'card_on_delivery'} onChange={handleInputChange(setPaymentMethod, 'paymentMethod')} />
                                <Form.Check type="radio" label="Наличными при получении" name="paymentMethod" id="cash_on_delivery" value="cash_on_delivery" checked={paymentMethod === 'cash_on_delivery'} onChange={handleInputChange(setPaymentMethod, 'paymentMethod')} />
                                <Form.Check type="radio" label="Оплатить сейчас (недоступно)" name="paymentMethod" id="pay_now" value="pay_now" disabled />
                            </Form.Group>
                        </Form>
                    </Card>
                </Col>
                <Col md={4}>
                    <h4 className='mt-3'>Ваш заказ</h4>
                    <Card className="p-4 mt-3">
                        {basket.basketDevices.map(item => (
                            <div key={item.id} className="d-flex justify-content-between mb-2">
                                <span>{item.device.name} x{item.quantity}</span>
                                <span>{new Intl.NumberFormat('ru-RU').format(item.device.price * item.quantity)} ₽</span>
                            </div>
                        ))}
                        <hr />
                        <div className="d-flex justify-content-between fw-bold fs-5">
                            <span>Итого:</span>
                            <span>{new Intl.NumberFormat('ru-RU').format(basket.totalPrice)} ₽</span>
                        </div>
                        <Button variant="dark" className="mt-4 w-100" onClick={handlePlaceOrder} disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Подтвердить заказ'}
                        </Button>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
});

export default Checkout;
// --- END OF FILE client/src/pages/Checkout.js ---