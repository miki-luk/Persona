// --- START OF FILE client/src/components/modals/CreateType.js ---
import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Form, Button} from "react-bootstrap";
import {createType} from "../../http/deviceAPI";

const CreateType = ({show, onHide}) => {
    const [value, setValue] = useState('')

    const addType = () => {
        if (!value.trim()) {
            return alert('Введите название типа');
        }
        // --- ↓↓↓ ИЗМЕНЕНИЯ ЗДЕСЬ ↓↓↓ ---
        createType({name: value}).then(data => {
            setValue('')
            onHide()
        }).catch(err => {
            // Добавляем обработку ошибки от сервера
            alert(err.response?.data?.message || 'Произошла ошибка при создании типа');
        });
        // --- ↑↑↑ КОНЕЦ ИЗМЕНЕНИЙ ↑↑↑ ---
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить тип
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={"Введите название типа"}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addType}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateType;
// --- END OF FILE client/src/components/modals/CreateType.js ---