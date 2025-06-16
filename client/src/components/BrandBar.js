import React, { useContext } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Accordion, ListGroup } from "react-bootstrap";

const BrandBar = observer(() => {
    const { device } = useContext(Context);

    return (
        <Accordion defaultActiveKey="0" alwaysOpen className="mt-3">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Бренды</Accordion.Header>
                <Accordion.Body>
                     <ListGroup>
                        <ListGroup.Item action active={!device.selectedBrand.id} onClick={() => device.setSelectedBrand({})}>
                             Все бренды
                         </ListGroup.Item>
                        {device.brands.map(brand =>
                            <ListGroup.Item action active={brand.id === device.selectedBrand.id} key={brand.id} onClick={() => device.setSelectedBrand(brand)}>
                                {brand.name}
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
});

export default BrandBar;