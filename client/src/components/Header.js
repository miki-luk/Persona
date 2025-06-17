import React, { useContext, useState } from 'react';
import { Container, Row, Col, Modal, Form, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, SHOP_ROUTE, FAVORITES_ROUTE, ACCOUNT_ROUTE } from "../utils/consts";
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import { Person, Search, Bag, Heart, BoxArrowRight } from 'react-bootstrap-icons';
import './Header.css';

const SearchModal = observer(({ show, onHide }) => {
    const navigate = useNavigate();
    const { device } = useContext(Context);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            return;
        }
        device.setSearchQuery(searchQuery);
        device.setSelectedDepartment({}); // Сбрасываем отдел при поиске
        device.setSelectedType({});
        device.setSelectedBrand({});
        navigate(SHOP_ROUTE);
        onHide();
        setSearchQuery('');
    };

    return (
        <Modal show={show} onHide={onHide} centered className="search-bar-modal">
            <Modal.Body>
                <Form className="d-flex" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                    <Form.Control
                        placeholder="Что вы ищете?"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    <Button variant="dark" onClick={handleSearch} className="ms-2">Найти</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
});

const Header = observer(() => {
    const { user, basket, device, favorite } = useContext(Context);
    const navigate = useNavigate();
    const [searchVisible, setSearchVisible] = useState(false);
    
    const isAdmin = user.isAuth && user.user.role === 'ADMIN';

    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
        basket.setBasketDevices([]);
        favorite.setFavorites([]);
        localStorage.removeItem('token');
        navigate(SHOP_ROUTE);
    };

    // --- КЛЮЧЕВОЕ ИЗМЕНЕНИЕ ЗДЕСЬ ---
    const resetToHomePage = (e) => {
        e.preventDefault();
        device.setSelectedDepartment({}); // <-- Сбрасываем выбранный отдел
        device.setSelectedType({});
        device.setSelectedBrand({});
        device.setSearchQuery('');
        device.setPage(1);
        navigate(SHOP_ROUTE); // Переходим на главную
    };

    return (
        <>
            <header className="header-wrapper">
                <Container>
                    <Row className="align-items-center main-header-row">
                        <Col xs={4} className="d-flex align-items-center gap-3">
                           {isAdmin &&
                                <Button variant="outline-dark" size="sm" onClick={() => navigate(ADMIN_ROUTE)}>Админ-панель</Button>
                           }
                        </Col>
                        <Col xs={4} className="text-center">
                            {/* Вызываем новую функцию */}
                            <NavLink to={SHOP_ROUTE} className="logo-link" onClick={resetToHomePage}>
                                PERSONA
                            </NavLink>
                        </Col>
                        <Col xs={4} className="d-flex justify-content-end align-items-center action-icons">
                            <Search className="action-icon-link" onClick={() => setSearchVisible(true)} />
                            <NavLink to={FAVORITES_ROUTE} className="action-icon-link position-relative">
                                <Heart />
                                {user.isAuth && favorite.favoriteCount > 0 &&
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                                        {favorite.favoriteCount}
                                    </span>
                                }
                            </NavLink>
                            <NavLink to={BASKET_ROUTE} className="action-icon-link position-relative">
                                <Bag />
                                {user.isAuth && basket.totalCount > 0 &&
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                                        {basket.totalCount}
                                    </span>
                                }
                            </NavLink>
                            {user.isAuth ? (
                                <>
                                    <NavLink to={ACCOUNT_ROUTE} className="action-icon-link"><Person /></NavLink>
                                    <BoxArrowRight className="action-icon-link" onClick={logOut} style={{cursor: 'pointer'}} />
                                </>
                            ) : (
                                <NavLink to={LOGIN_ROUTE} className="action-icon-link"><Person /></NavLink>
                            )}
                        </Col>
                    </Row>
                </Container>
            </header>
            <SearchModal show={searchVisible} onHide={() => setSearchVisible(false)} />
        </>
    );
});

export default Header;