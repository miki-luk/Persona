import React, { useContext, useEffect } from 'react';
import { Container, Row, Col } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchDevices, fetchTypes, fetchBrands } from "../http/deviceAPI";
import DeviceList from "../components/DeviceList";
import DiscountBanner from '../components/DiscountBanner'; 
import './Shop.css';
const categoryImages = {
    'Новинки': '/images/cat-new.jpg',
    'Одежда': '/images/cat-clothes.jpg',
    'Обувь': '/images/cat-shoes.jpg',
    'Аксессуары': '/images/cat-accs.jpg',
    'Куртка': '/images/cat-clothes.jpg', 
};
const defaultCategoryImage = '/images/banner.jpg'; 
const Shop = observer(() => {
    const { device } = useContext(Context);

    useEffect(() => {
        fetchTypes().then(data => device.setTypes(data));
        fetchBrands().then(data => device.setBrands(data));
        
        fetchDevices(null, null, 1, 12).then(data => {
            if (data) {
                device.setDevices(data.rows);
                device.setTotalCount(data.count);
            }
        });
    }, []);

    useEffect(() => {
        fetchDevices(
            device.selectedType?.id,
            device.selectedBrand?.id,
            device.page,
            12,
            device.searchQuery
        ).then(data => {
            if (data) {
                device.setDevices(data.rows);
                device.setTotalCount(data.count);
            }
        });
    }, [device.page, device.selectedType, device.selectedBrand, device.searchQuery]);

    const handleCategoryClick = (type) => {
        device.setSelectedType(type);
        device.setSelectedBrand({});
        device.setSearchQuery('');
        device.setPage(1);
    };

    return (
        <>
            <div className="promo-banner">
                <div className="banner-text-content">
                    <h1 className="promo-title-main">PERSONA</h1>
                    <h2 className="promo-title-sub">Новая коллекция</h2>
                </div>
            </div>

            <Container className="category-grid">
                <Row>
                    {device.types.map(type => (
                        <Col md={3} key={type.id} className="mb-4">
                            <a 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); handleCategoryClick(type); }} 
                                className="category-card" 
                                style={{backgroundImage: `url(${categoryImages[type.name] || defaultCategoryImage})`}}
                            >
                                <span className="category-title">{type.name}</span>
                            </a>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* --- ШАГ 2: ВСТАВЛЯЕМ КОМПОНЕНТ БАННЕРА ЗДЕСЬ --- */}
            <DiscountBanner />
            {/* ----------------------------------------------- */}

            <Container className="mb-5">
                <h2 className="catalog-title">Каталог Товаров</h2>
                <DeviceList />
            </Container>
        </>
    );
});

export default Shop;