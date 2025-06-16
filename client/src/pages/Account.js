// --- START OF FILE client/src/pages/Account.js ---
import React, { useContext } from 'react';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ACCOUNT_ROUTE, FAVORITES_ROUTE } from '../utils/consts';
import './Account.css';

const Account = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();

    return (
        <Container className="account-page mt-5 mb-5">
            <Row>
                <Col md={3}>
                    <Card className="p-3 account-sidebar">
                        <h4>Личный кабинет</h4>
                        <p className="text-muted">{user.user.email}</p>
                        <hr />
                        {/* Используем Nav из react-bootstrap и NavLink из react-router-dom */}
                        <Nav className="flex-column" variant="pills">
                            <Nav.Link as={NavLink} to={ACCOUNT_ROUTE} end // `end` для точного совпадения
                                className={location.pathname === ACCOUNT_ROUTE ? 'active' : ''}>
                                История заказов
                            </Nav.Link>
                            <Nav.Link as={NavLink} to={`${ACCOUNT_ROUTE}/profile`}
                                className={location.pathname.includes('/profile') ? 'active' : ''}>
                                Профиль
                            </Nav.Link>
                            <Nav.Link as={NavLink} to={FAVORITES_ROUTE}
                                className={location.pathname === FAVORITES_ROUTE ? 'active' : ''}>
                                Избранное
                            </Nav.Link>
                        </Nav>
                    </Card>
                </Col>
                <Col md={9}>
                    {/* Outlet будет рендерить дочерний маршрут */}
                    <Outlet />
                </Col>
            </Row>
        </Container>
    );
});

export default Account;
// --- END OF FILE client/src/pages/Account.js ---