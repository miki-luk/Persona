import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Breadcrumb, Spinner } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchDevices, fetchTypes, fetchBrands, fetchDepartments } from "../http/deviceAPI";
import TypeBar from "../components/TypeBar";
import BrandBar from "../components/BrandBar";
import DeviceList from "../components/DeviceList";
import Pages from "../components/Pages";
import './Shop.css'; 

const departmentImages = {
    'мужской': '/images/dept-men.jpg',  // <-- ИСПРАВЛЕНО
    'женский': '/images/dept-women.jpg', // <-- ИСПРАВЛЕНО
    'детский': '/images/dept-kids.jpg', // <-- ИСПРАВЛЕНО
};
const defaultDeptImage = '/images/banner.jpg';

const Shop = observer(() => {
    const { device } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDepartments().then(data => {
            device.setDepartments(data);
        }).finally(() => {
            setLoading(false);
        });
    }, [device]);

    useEffect(() => {
        if (device.selectedDepartment.id) {
            fetchTypes(device.selectedDepartment.id).then(data => device.setTypes(data));
            fetchBrands(device.selectedDepartment.id).then(data => device.setBrands(data));
        } else {
            // Если отдел не выбран, можно либо загружать все, либо очищать
            device.setTypes([]);
            device.setBrands([]);
        }
    }, [device.selectedDepartment, device]);

    useEffect(() => {
        fetchDevices(
            device.selectedDepartment?.id,
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
    }, [device.page, device.selectedType, device.selectedBrand, device.searchQuery, device.selectedDepartment]);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    if (device.searchQuery || device.selectedDepartment.id) {
        return (
            <Container className="my-4">
                {device.selectedDepartment.id && (
                     <Breadcrumb>
                        <Breadcrumb.Item onClick={() => device.setSelectedDepartment({})} style={{ cursor: 'pointer' }}>Все отделы</Breadcrumb.Item>
                        <Breadcrumb.Item active>{device.selectedDepartment.name}</Breadcrumb.Item>
                    </Breadcrumb>
                )}
                {device.searchQuery && (
                    <h2 className="text-center text-muted mb-4">
                        Результаты поиска: "{device.searchQuery}"
                    </h2>
                )}
                <Row>
                    <Col md={3}>
                        <TypeBar />
                        <BrandBar />
                    </Col>
                    <Col md={9}>
                        <DeviceList />
                        <Pages />
                    </Col>
                </Row>
            </Container>
        );
    }
    
    return (
        <>
            <div className="promo-banner" style={{ backgroundImage: `url(/images/banner.jpg)` }}>
                <div className="banner-text-content">
                    <h1 className="promo-title-main">PERSONA</h1>
                    <h2 className="promo-title-sub">Новая коллекция</h2>
                </div>
            </div>
            <Container className="my-5">
                <h2 className="text-center mb-5 catalog-title">Выберите отдел</h2>
                <Row>
                    {device.departments.map(dept => (
                        <Col md={4} key={dept.id} className="mb-4">
                            <a href="#" onClick={(e) => { e.preventDefault(); device.setSelectedDepartment(dept); }} className="category-card" style={{ backgroundImage: `url(${departmentImages[dept.name.toLowerCase()] || defaultDeptImage})`}}>
                                <span className="category-title">{dept.name}</span>
                            </a>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
});

export default Shop;