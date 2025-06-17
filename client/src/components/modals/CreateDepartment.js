// --- START OF FILE client/src/components/modals/CreateDepartment.js ---
import React, { useState } from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { createDepartment } from "../../http/deviceAPI";

const CreateDepartment = ({ show, onHide }) => {
    const [value, setValue] = useState('');

    const addDepartment = () => {
        if (!value.trim()) {
            // Эта проверка остается на клиенте для быстрой обратной связи
            return alert('Введите название отдела');
        }
        // --- ↓↓↓ ИЗМЕНЕНИЯ ЗДЕСЬ ↓↓↓ ---
        createDepartment({ name: value }).then(data => {
            setValue('');
            onHide();
        }).catch(err => {
            // Добавляем обработку ошибки от сервера
            alert(err.response?.data?.message || 'Произошла ошибка при создании отдела');
        });
        // --- ↑↑↑ КОНЕЦ ИЗМЕНЕНИЙ ↑↑↑ ---
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить отдел
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={"Введите название отдела"}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addDepartment}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateDepartment;
// --- END OF FILE client/src/components/modals/CreateDepartment.js ---