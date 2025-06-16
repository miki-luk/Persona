// client/src/components/DiscountBanner.js

import React from 'react';
import { Container, Button } from 'react-bootstrap';
import './DiscountBanner.css';

const DiscountBanner = () => {
    return (
        <Container className="my-5">
            <div className="discount-banner-wrapper">
                <div className="banner-text">
                    <h2 className="banner-title">Сезонная распродажа</h2>
                    <p className="banner-subtitle">Скидки до <span className="highlight">50%</span> на избранные товары</p>
                </div>
                <Button variant="light" className="banner-action-btn">Смотреть все</Button>
            </div>
        </Container>
    );
};

export default DiscountBanner;