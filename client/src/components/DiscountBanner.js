import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Gift } from 'react-bootstrap-icons';
import './DiscountBanner.css';

const DiscountBanner = () => {
    return (
        <Container className="my-5">
            <div className="discount-banner-wrapper">
                <div className="banner-icon-area">
                    <Gift size={50} />
                </div>
                <div className="banner-text">
                    <h2 className="banner-title">Эксклюзивная скидка 20%</h2>
                    <p className="banner-subtitle">Только на этой неделе на всю летнюю коллекцию!</p>
                </div>
                <Button variant="light" className="banner-action-btn">
                    К покупкам
                </Button>
            </div>
        </Container>
    );
};

export default DiscountBanner;