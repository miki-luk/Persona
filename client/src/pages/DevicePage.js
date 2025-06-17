// --- START OF FILE client/src/pages/DevicePage.js ---
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner, Accordion, Table, Card, Form, FloatingLabel } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { fetchOneDevice, addRating } from "../http/deviceAPI";
import { addToBasket } from "../http/basketAPI";
import { Context } from "../index";
import { StarFill } from "react-bootstrap-icons";
import { observer } from "mobx-react-lite";
import './DevicePage.css';

const DevicePage = observer(() => {
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [selectedSize, setSelectedSize] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    const { id } = useParams();
    const { user, basket } = useContext(Context);

    const loadDevice = () => {
        setLoading(true);
        fetchOneDevice(id).then(data => {
            if (data) {
                setDevice(data);
                setMainImage(data.img); // ИЗМЕНЕНИЕ
            }
        }).finally(() => setLoading(false));
    };

    useEffect(() => {
        loadDevice();
    }, [id]);

    const handleAddToCart = () => {
        if (!user.isAuth) {
            return alert('Пожалуйста, авторизуйтесь, чтобы добавить товар в корзину.');
        }
        
        const sizes = device.info.find(i => i.title.toLowerCase() === 'sizes')?.description.split(',') || [];
        if (sizes.length > 0 && !selectedSize) {
            return alert('Пожалуйста, выберите размер.');
        }

        addToBasket(device.id).then((newItem) => {
            basket.addDevice(newItem);
            alert(`Товар "${device.name}" добавлен в корзину!`);
        }).catch(e => alert(e.response?.data?.message || 'Произошла ошибка'));
    };

    const handleAddReview = () => {
        if (!user.isAuth) return alert('Пожалуйста, авторизуйтесь, чтобы оставить отзыв.');
        if (rating === 0) return alert('Пожалуйста, поставьте оценку.');
        
        addRating(id, rating, reviewText).then(() => {
            alert('Спасибо за ваш отзыв!');
            setRating(0);
            setReviewText('');
            loadDevice();
        }).catch(e => alert(e.response?.data?.message || 'Ошибка добавления отзыва'));
    };
    
    if (loading) return <Container className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" /></Container>;
    if (!device) return <Container className="text-center mt-5"><h2>Товар не найден</h2></Container>;

    const specs = device.info.filter(i => i.title.toLowerCase() !== 'sizes' && i.title.toLowerCase() !== 'image');
    const sizes = device.info.find(i => i.title.toLowerCase() === 'sizes')?.description.split(',').map(s => s.trim()) || [];
    // Теперь 'description' тоже содержит полный URL
    const images = [device.img, ...device.info.filter(i => i.title.toLowerCase() === 'image').map(i => i.description)];
    const averageRating = device.ratings?.length > 0 ? (device.ratings.reduce((sum, r) => sum + r.rate, 0) / device.ratings.length).toFixed(1) : '0';

    return (
        <Container className="product-page-container">
            <Row>
                <Col md={7}>
                    <div className="product-gallery">
                        <div className="thumbnails-column">
                            {images.map((img, index) => (
                                <img 
                                    key={index} 
                                    src={img} // ИЗМЕНЕНИЕ
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`thumbnail-image ${mainImage === img ? 'active' : ''}`} // ИЗМЕНЕНИЕ
                                    onMouseEnter={() => setMainImage(img)} /> // ИЗМЕНЕНИЕ
                            ))}
                        </div>
                        <div className="main-image-wrapper">
                            <img src={mainImage} alt="Main product" className="main-image"/>
                        </div>
                    </div>
                </Col>
                <Col md={5} className="product-details">
                    <h2 className="brand-name">
                        {device.brand?.name || 'Бренд'} / <span className="product-name">{device.name}</span>
                    </h2>

                    <div className="rating-section">
                        <StarFill style={{color: '#ffc107'}}/> 
                        <span>{averageRating}</span>
                        <a href="#reviews" className="ms-2 text-muted">({device.ratings?.length || 0} отзывов)</a>
                    </div>

                    <div className="price-section">
                        {new Intl.NumberFormat('ru-RU').format(device.price)} ₽
                    </div>

                    {sizes.length > 0 && (
                        <>
                            <div className="variant-selector-title">Размер</div>
                            <div className="variant-selector">
                                {sizes.map(size => (
                                    <button 
                                        key={size} 
                                        className={`size-button ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    <Button variant="dark" className="add-to-cart-button" onClick={handleAddToCart}>
                        Добавить в корзину
                    </Button>
                </Col>
            </Row>

            <Accordion defaultActiveKey={['0']} alwaysOpen className="details-accordion">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Описание и характеристики</Accordion.Header>
                    <Accordion.Body>
                        {specs.length > 0 ? (
                            <Table borderless striped className="specs-table">
                                <tbody>
                                    {specs.map(info => (
                                        <tr key={info.id}>
                                            <td className="spec-title">{info.title}</td>
                                            <td>{info.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : <p>Дополнительной информации нет.</p>}
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1" id="reviews">
                    <Accordion.Header>Отзывы ({device.ratings?.length || 0})</Accordion.Header>
                    <Accordion.Body>
                        {user.isAuth && (
                            <Card className="p-3 my-4 bg-light border-0">
                                <h5>Оставить отзыв</h5>
                                <div className="rating-stars" onMouseLeave={() => setHoverRating(0)}>
                                    {[...Array(5)].map((_, index) => {
                                        const starValue = index + 1;
                                        return ( <StarFill key={index} className={`star-icon ${starValue <= (hoverRating || rating) ? 'active' : ''}`}
                                                onClick={() => setRating(starValue)} onMouseEnter={() => setHoverRating(starValue)} /> );
                                    })}
                                </div>
                                <FloatingLabel controlId="floatingTextarea2" label="Ваш комментарий" className="my-3">
                                    <Form.Control as="textarea" style={{ height: '100px' }} value={reviewText} onChange={e => setReviewText(e.target.value)} />
                                </FloatingLabel>
                                <Button variant="dark" onClick={handleAddReview} className="align-self-start">Отправить</Button>
                            </Card>
                        )}
                        {device.ratings && device.ratings.length > 0 ? device.ratings.map(r => (
                            <div key={r.id} className="review-card mb-3 p-3 border rounded">
                                <div className="d-flex justify-content-between">
                                    <strong>{r.user?.email || 'Аноним'}</strong>
                                    <small className="text-muted">{new Date(r.createdAt).toLocaleDateString()}</small>
                                </div>
                                <div className="d-flex align-items-center my-1">
                                    {[...Array(5)].map((_, i) => <StarFill key={i} className={`star-icon ${i < r.rate ? 'active' : ''}`} />)}
                                    <span className='ms-2 fw-bold'>{r.rate}</span>
                                </div>
                                {r.review && <p className="mb-0 mt-2">{r.review}</p>}
                            </div>
                        )) : <p className="text-muted mt-3">Отзывов пока нет. Будьте первым!</p>}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
});

export default DevicePage;
// --- END OF FILE client/src/pages/DevicePage.js ---