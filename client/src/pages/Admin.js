import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Spinner, Table } from "react-bootstrap";
import CreateBrand from "../components/modals/CreateBrand";
import CreateDevice from "../components/modals/CreateDevice";
import CreateType from "../components/modals/CreateType";
import CreateDepartment from "../components/modals/CreateDepartment"; // <-- ИМПОРТ
import { fetchAllOrders } from '../http/orderAPI';
import './Admin.css'; 

const Admin = () => {
    const [brandVisible, setBrandVisible] = useState(false);
    const [typeVisible, setTypeVisible] = useState(false);
    const [deviceVisible, setDeviceVisible] = useState(false);
    const [departmentVisible, setDepartmentVisible] = useState(false); // <-- НОВОЕ СОСТОЯНИЕ
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllOrders()
            .then(data => setOrders(data))
            .finally(() => setLoading(false));
    }, []);

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = orders.length;

    return (
        <Container fluid className="admin-dashboard p-4">
            <Row className="mb-4">
                <Col><h1>Панель администратора</h1></Col>
            </Row>
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="stat-card">
                        <Card.Body>
                            <Card.Title>Всего заказов</Card.Title>
                            <Card.Text className="stat-number">{totalOrders}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="stat-card">
                        <Card.Body>
                            <Card.Title>Общая выручка</Card.Title>
                            <Card.Text className="stat-number">{new Intl.NumberFormat('ru-RU').format(totalRevenue)} ₽</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header as="h5">Действия</Card.Header>
                        <Card.Body className="d-flex gap-3">
                            <Button variant="dark" onClick={() => setDepartmentVisible(true)}>Добавить отдел</Button> {/* <-- НОВАЯ КНОПКА */}
                            <Button variant="dark" onClick={() => setTypeVisible(true)}>Добавить тип</Button>
                            <Button variant="dark" onClick={() => setBrandVisible(true)}>Добавить бренд</Button>
                            <Button variant="success" onClick={() => setDeviceVisible(true)}>Добавить одежду</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <Row>
                <Col>
                    <Card>
                         <Card.Header as="h5">Последние заказы</Card.Header>
                         <Card.Body>
                            {loading ? <Spinner animation="border" /> : (
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Email клиента</th>
                                            <th>Дата</th>
                                            <th>Статус</th>
                                            <th>Сумма</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{order.user.email}</td>
                                                <td>{new Date(order.createdAt).toLocaleString()}</td>
                                                <td>{order.status}</td>
                                                <td>{new Intl.NumberFormat('ru-RU').format(order.totalPrice)} ₽</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                         </Card.Body>
                    </Card>
                </Col>
            </Row>

            <CreateDepartment show={departmentVisible} onHide={() => setDepartmentVisible(false)}/> {/* <-- НОВАЯ МОДАЛКА */}
            <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)}/>
            <CreateDevice show={deviceVisible} onHide={() => setDeviceVisible(false)}/>
            <CreateType show={typeVisible} onHide={() => setTypeVisible(false)}/>
        </Container>
    );
};

export default Admin;