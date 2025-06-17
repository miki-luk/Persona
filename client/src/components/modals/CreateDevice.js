import React, { useContext, useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { Button, Dropdown, Form, Row, Col, Badge } from "react-bootstrap";
import { Context } from "../../index";
import { createDevice, fetchBrands, fetchTypes, fetchDepartments } from "../../http/deviceAPI";
import { observer } from "mobx-react-lite";

const CreateDevice = observer(({ show, onHide }) => {
    const { device } = useContext(Context);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [files, setFiles] = useState([]); // Состояние для хранения файлов
    const [info, setInfo] = useState([]);
    const [sizes, setSizes] = useState('');

    useEffect(() => {
        if (show) {
            fetchDepartments().then(data => device.setDepartments(data));
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
        device.setSelectedDepartment({});
        device.setSelectedType({});
        device.setSelectedBrand({});
        onHide();
    };

    const addInfo = () => {
        setInfo([...info, { title: '', description: '', number: Date.now() }]);
    };
    const removeInfo = (number) => {
        setInfo(info.filter(i => i.number !== number));
    };
    const changeInfo = (key, value, number) => {
        setInfo(info.map(i => i.number === number ? { ...i, [key]: value } : i));
    };

    // --- ИЗМЕНЕНИЕ ЗДЕСЬ: Обработка выбора нескольких файлов ---
    const selectFiles = e => {
        // e.target.files - это FileList, преобразуем его в массив
        setFiles(Array.from(e.target.files));
    };

    const addDevice = () => {
        if (!device.selectedDepartment?.id || !device.selectedType?.id || !device.selectedBrand?.id || !name.trim() || price <= 0 || files.length === 0) {
            alert('Пожалуйста, заполните все обязательные поля (отдел, тип, бренд, название, цена) и выберите хотя бы одно изображение.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', `${price}`);
        formData.append('brandId', device.selectedBrand.id);
        formData.append('typeId', device.selectedType.id);
        formData.append('departmentId', device.selectedDepartment.id);
        
        // Добавляем все файлы в formData
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
                <Modal.Title>Добавить товар</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* ... (дропдауны остаются без изменений) ... */}
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{device.selectedDepartment?.name || "Выберите отдел"}</Dropdown.Toggle>
                        <Dropdown.Menu>{device.departments.map(d => <Dropdown.Item onClick={() => device.setSelectedDepartment(d)} key={d.id}>{d.name}</Dropdown.Item>)}</Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{device.selectedType?.name || "Выберите тип"}</Dropdown.Toggle>
                        <Dropdown.Menu>{device.types.map(t => <Dropdown.Item onClick={() => device.setSelectedType(t)} key={t.id}>{t.name}</Dropdown.Item>)}</Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{device.selectedBrand?.name || "Выберите бренд"}</Dropdown.Toggle>
                        <Dropdown.Menu>{device.brands.map(b => <Dropdown.Item onClick={() => device.setSelectedBrand(b)} key={b.id}>{b.name}</Dropdown.Item>)}</Dropdown.Menu>
                    </Dropdown>
                    
                    <Form.Control value={name} onChange={e => setName(e.target.value)} className="mt-3" placeholder="Введите название"/>
                    <Form.Control value={price} onChange={e => setPrice(Number(e.target.value))} className="mt-3" placeholder="Введите стоимость" type="number"/>
                    
                    <Form.Label className="mt-3">Изображения (первое будет главным)</Form.Label>
                    {/* --- ИЗМЕНЕНИЕ ЗДЕСЬ: добавляем атрибут multiple --- */}
                    <Form.Control className="mt-1" type="file" multiple onChange={selectFiles}/>

                    {/* --- НОВЫЙ БЛОК: Визуальное отображение выбранных файлов --- */}
                    {files.length > 0 && (
                        <div className="mt-2">
                            {files.map((file, index) => (
                                <Badge pill bg="secondary" key={index} className="me-1">
                                    {file.name}
                                </Badge>
                            ))}
                        </div>
                    )}

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