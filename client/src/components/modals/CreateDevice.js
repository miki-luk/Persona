// --- START OF FILE client/src/components/modals/CreateDevice.js ---
import React, {useContext, useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Button, Dropdown, Form, Row, Col} from "react-bootstrap";
import {Context} from "../../index";
import {createDevice, fetchBrands, fetchTypes} from "../../http/deviceAPI";
import {observer} from "mobx-react-lite";

const CreateDevice = observer(({show, onHide}) => {
    const {device} = useContext(Context);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [files, setFiles] = useState([]); // Изменено на массив
    const [info, setInfo] = useState([]);
    const [sizes, setSizes] = useState(''); // Новое состояние для размеров

    useEffect(() => {
        if (show) {
            fetchTypes().then(data => device.setTypes(data));
            fetchBrands().then(data => device.setBrands(data));
        }
    }, [show, device]);

    const cleanUp = () => {
        setName('');
        setPrice(0);
        setFiles([]);
        setInfo([]);
        setSizes('');
        device.setSelectedType({});
        device.setSelectedBrand({});
        onHide();
    };

    const addInfo = () => {
        setInfo([...info, {title: '', description: '', number: Date.now()}]);
    };
    const removeInfo = (number) => {
        setInfo(info.filter(i => i.number !== number));
    };
    const changeInfo = (key, value, number) => {
        setInfo(info.map(i => i.number === number ? {...i, [key]: value} : i));
    };

    const selectFiles = e => {
        setFiles([...e.target.files]);
    };

    const addDevice = () => {
        if (!device.selectedType?.id || !device.selectedBrand?.id || !name.trim() || price <= 0 || files.length === 0) {
            alert('Пожалуйста, заполните все обязательные поля и выберите хотя бы одно изображение.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', `${price}`);
        formData.append('brandId', device.selectedBrand.id);
        formData.append('typeId', device.selectedType.id);

        files.forEach(file => {
            formData.append('img', file);
        });

        const finalInfo = [...info];
        if (sizes.trim()) {
            finalInfo.push({
                title: 'sizes',
                description: sizes,
                number: Date.now()
            });
        }
        formData.append('info', JSON.stringify(finalInfo));
        
        createDevice(formData).then(data => {
            cleanUp();
        }).catch(error => {
            alert(error.response?.data?.message || 'Произошла ошибка');
        });
    };

    return (
        <Modal show={show} onHide={cleanUp} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Добавить одежду</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* --- ВОЗВРАЩАЕМ ПОЛНЫЙ КОД ДРОПДАУНОВ --- */}
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{device.selectedType?.name || "Выберите тип"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {device.types.map(type =>
                                <Dropdown.Item onClick={() => device.setSelectedType(type)} key={type.id}>
                                    {type.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{device.selectedBrand?.name || "Выберите бренд"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {device.brands.map(brand =>
                                <Dropdown.Item onClick={() => device.setSelectedBrand(brand)} key={brand.id}>
                                    {brand.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    {/* ------------------------------------------- */}

                    <Form.Control value={name} onChange={e => setName(e.target.value)} className="mt-3" placeholder="Введите название"/>
                    <Form.Control value={price} onChange={e => setPrice(Number(e.target.value))} className="mt-3" placeholder="Введите стоимость" type="number"/>
                    
                    <Form.Label className="mt-3">Изображения (первое будет главным)</Form.Label>
                    <Form.Control className="mt-1" type="file" multiple onChange={selectFiles}/>

                    <hr/>
                    
                    <Form.Label className="mt-3">Размеры</Form.Label>
                    <Form.Control value={sizes} onChange={e => setSizes(e.target.value)} className="mt-1" placeholder="Введите размеры через запятую (например: S, M, L, XL)"/>


                    <hr/>
                    <Button variant={"outline-dark"} onClick={addInfo}>Добавить новое свойство</Button>
                    {info.map(i =>
                        <Row className="mt-4" key={i.number}>
                            <Col md={4}><Form.Control value={i.title} onChange={(e) => changeInfo('title', e.target.value, i.number)} placeholder="Свойство"/></Col>
                            <Col md={4}><Form.Control value={i.description} onChange={(e) => changeInfo('description', e.target.value, i.number)} placeholder="Описание"/></Col>
                            <Col md={4}><Button onClick={() => removeInfo(i.number)} variant={"outline-danger"}>Удалить</Button></Col>
                        </Row>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={cleanUp}>Закрыть</Button>
                <Button variant="outline-success" onClick={addDevice}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateDevice;
// --- END OF FILE client/src/components/modals/CreateDevice.js ---