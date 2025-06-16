// --- START OF FILE client/src/components/Header.js ---
import React, { useContext, useState } from 'react';
import { Container, Row, Col, Modal, Form } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, SHOP_ROUTE, FAVORITES_ROUTE, ACCOUNT_ROUTE } from "../utils/consts";
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import { Person, Search, Bag, Heart } from 'react-bootstrap-icons';
import './Header.css';

// Модальное окно поиска (остается без изменений)
const SearchModal = ({ show, onHide }) => {
    const navigate = useNavigate();
    const { device } = useContext(Context);
    const [searchQuery, setSearchQuery] = useState('');
    
    const handleSearch = () => {
        device.setSearchQuery(searchQuery);
        device.setSelectedType({});
        navigate(SHOP_ROUTE);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered className="search-bar-modal">
            <Modal.Body>
                <Form.Control 
                    placeholder="Поиск..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSearch()}
                />
            </Modal.Body>
        </Modal>
    );
};

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
        navigate(SHOP_ROUTE); // Перенаправляем на главную после выхода
    };

    const resetFilters = () => {
        device.setSelectedType({});
        device.setSearchQuery('');
        device.setPage(1);
    };

    return (
        <>
            <header className="header-wrapper">
                <Container>
                    <Row className="align-items-center main-header-row">
                        <Col xs={4}>
                            {isAdmin && (
                                <a href="#" onClick={(e) => {e.preventDefault(); navigate(ADMIN_ROUTE)}} className="admin-panel-link">
                                    Админ-панель
                                </a>
                            )}
                        </Col>
                        <Col xs={4} className="text-center">
                            <NavLink to={SHOP_ROUTE} className="logo-link" onClick={resetFilters}>
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

                            {/* --- БЛОК ЛОГИНА/ПРОФИЛЯ --- */}
                            {user.isAuth ? (
                                <NavLink to={ACCOUNT_ROUTE} className="action-icon-link">
                                     <Person />
                                </NavLink>
                            ) : (
                                <NavLink to={LOGIN_ROUTE} className="action-icon-link">
                                    <Person />
                                </NavLink>
                            )}

                            {/* --- КНОПКА ВЫЙТИ ОТДЕЛЬНО --- */}
                            {user.isAuth && <a href="#" onClick={logOut} className="action-icon-link">Выйти</a>}
                            
                            <NavLink to={BASKET_ROUTE} className="action-icon-link position-relative">
                                <Bag />
                                {user.isAuth && basket.totalCount > 0 &&
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                                        {basket.totalCount}
                                    </span>
                                }
                            </NavLink>
                        </Col>
                    </Row>
                </Container>
            </header>

            <SearchModal show={searchVisible} onHide={() => setSearchVisible(false)} />
        </>
    );
});

export default Header;
// --- END OF FILE client/src/components/Header.js ---