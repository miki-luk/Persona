// --- START OF FILE client/src/components/account/OrderHistory.js ---
import React, { useEffect, useState } from 'react';
import { Spinner, Accordion, Image } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { fetchUserOrders } from '../../http/orderAPI';

const OrderHistory = observer(() => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserOrders()
            .then(data => setOrders(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="d-flex justify-content-center mt-5"><Spinner animation="border" /></div>;
    }

    return (
        <div>
            <h2>История заказов</h2>
            {orders.length === 0 ? (
                <p className="mt-3 text-muted">У вас пока нет заказов.</p>
            ) : (
                <Accordion alwaysOpen className="mt-3">
                    {orders.map((order, index) => (
                        <Accordion.Item eventKey={String(index)} key={order.id} className="mb-3">
                            <Accordion.Header>
                                <div className="order-header">
                                    <span>Заказ №{order.id} от {new Date(order.createdAt).toLocaleDateString()}</span>
                                    <span className={`status status-${order.status.toLowerCase().replace(' ', '-')}`}>{order.status}</span>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <h5>Состав заказа:</h5>
                                {order.items.map(item => (
                                    <div key={item.id} className="order-item">
                                        <Image src={process.env.REACT_APP_API_URL + item.device.img} thumbnail width={60} />
                                        <div className="order-item-details">
                                            <div>{item.device.name}</div>
                                            <div className="text-muted">{item.quantity} шт. x {new Intl.NumberFormat('ru-RU').format(item.price)} ₽</div>
                                        </div>
                                    </div>
                                ))}
                                <hr />
                                <div className="text-end fw-bold fs-5">
                                    Итого: {new Intl.NumberFormat('ru-RU').format(order.totalPrice)} ₽
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            )}
        </div>
    );
});

export default OrderHistory;
// --- END OF FILE client/src/components/account/OrderHistory.js ---