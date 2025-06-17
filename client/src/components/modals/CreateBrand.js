import React, { useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { Button, Form } from "react-bootstrap";
import { createBrand } from "../../http/deviceAPI"; // Убедись, что импортируется createBrand

const CreateBrand = ({ show, onHide }) => {
    const [value, setValue] = useState('');

    const addBrand = () => {
        if (!value.trim()) {
            return alert('Введите название бренда');
        }
        // Вызываем правильную функцию createBrand
        createBrand({ name: value }).then(data => {
            setValue('');
            onHide();
        }).catch(err => {
            // Теперь мы должны получать осмысленные ошибки
            alert(err.response?.data?.message || 'Произошла ошибка');
        });
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить бренд {/* Исправляем заголовок */}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={"Введите название бренда"} // Исправляем плейсхолдер
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addBrand}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateBrand;