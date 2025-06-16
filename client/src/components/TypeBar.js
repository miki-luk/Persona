import React, { useContext } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Accordion, ListGroup } from "react-bootstrap";

const TypeBar = observer(() => {
    const { device } = useContext(Context);

    return (
        <Accordion defaultActiveKey={['0', '1']} alwaysOpen className="filter-accordion">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Категории</Accordion.Header>
                <Accordion.Body>
                    <ListGroup className="filter-list">
                        <ListGroup.Item
                            active={!device.selectedType.id}
                            onClick={() => device.setSelectedType({})}
                        >
                            Все категории
                        </ListGroup.Item>
                        {device.types.map(type =>
                            <ListGroup.Item
                                active={type.id === device.selectedType.id}
                                onClick={() => device.setSelectedType(type)}
                                key={type.id}
                            >
                                {type.name}
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
});

export default TypeBar;