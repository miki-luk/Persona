// --- START OF FILE client/src/components/Footer.js ---
import React from 'react';
import { Container, Row, Col, Nav, Form, Button } from "react-bootstrap";
import { NavLink } from 'react-router-dom';
import { SHOP_ROUTE } from '../utils/consts';
import { Youtube, Telegram, Instagram } from 'react-bootstrap-icons';
import './Footer.css'; // Подключаем новые стили

const Footer = () => {
    return (
        <footer className="footer-section">
            <Container>
                <Row className="gy-5">
                    {/* --- КОЛОНКА С ЛОГОТИПОМ И ОПИСАНИЕМ --- */}
                    <Col lg={4} md={12}>
                        <div className="footer-logo-wrap">
                            <NavLink to={SHOP_ROUTE} className="footer-logo">
                                PERSONA
                            </NavLink>
                            <p className="footer-description">
                                Ваш надежный поставщик эксклюзивной одежды и обуви. Качество и стиль в каждой детали.
                            </p>
                        </div>
                        <div className="social-links-wrap">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Instagram /></a>
                            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer"><Telegram /></a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><Youtube /></a>
                        </div>
                    </Col>

                    {/* --- КОЛОНКА С НАВИГАЦИЕЙ --- */}
                    <Col lg={2} md={4} sm={6}>
                        <h4 className="footer-widget-title">Навигация</h4>
                        <Nav className="flex-column footer-nav">
                            <Nav.Link as={NavLink} to={SHOP_ROUTE}>Главная</Nav.Link>
                            <Nav.Link as={NavLink} to="#">О нас</Nav.Link>
                            <Nav.Link as={NavLink} to="#">Доставка и оплата</Nav.Link>
                            <Nav.Link as={NavLink} to="#">Контакты</Nav.Link>
                        </Nav>
                    </Col>

                    {/* --- КОЛОНКА С КОНТАКТАМИ --- */}
                    <Col lg={3} md={4} sm={6}>
                        <h4 className="footer-widget-title">Контакты</h4>
                        <ul className="footer-contact-list">
                            <li><span>Адрес:</span> г.Железногорск Илимский 8кв д.11</li>
                            <li><span>Телефон:</span> <a href="tel:+79991234567">+7 (999) 123-45-67</a></li>
                            <li><span>Email:</span> <a href="mailto:support@persona.com">support@persona.com</a></li>
                        </ul>
                    </Col>

                    {/* --- КОЛОНКА С ПОДПИСКОЙ --- */}
                    <Col lg={3} md={4}>
                         <h4 className="footer-widget-title">Подписка</h4>
                         <p className="footer-description">
                            Будьте в курсе новых поступлений и эксклюзивных скидок.
                         </p>
                         <Form className="subscribe-form">
                            <Form.Control type="email" placeholder="Ваш Email" className="subscribe-input" />
                            <Button variant="dark" type="submit" className="subscribe-button">
                                →
                            </Button>
                         </Form>
                    </Col>
                </Row>
                
                {/* --- НИЖНЯЯ ЧАСТЬ ФУТЕРА --- */}
                <Row className="copyright-wrap">
                    <Col>
                        <p className="copyright-text">
                            © {new Date().getFullYear()} PERSONA. Все права защищены.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
// --- END OF FILE client/src/components/Footer.js ---