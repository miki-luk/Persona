import React, { useContext } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Row } from "react-bootstrap";
import DeviceItem from "./DeviceItem";

const DeviceList = observer(() => {
    const { device } = useContext(Context);

    // Добавим проверку на случай, если товары еще не загрузились
    if (!device.devices || device.devices.length === 0) {
        return <div className="text-center mt-5">Товары не найдены</div>
    }

    return (
        <Row>
            {device.devices.map(deviceItem =>
                <DeviceItem key={deviceItem.id} device={deviceItem} />
            )}
        </Row>
    );
});

export default DeviceList;