import React, { useContext } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../index";

const TypeBar = observer(() => {
    const { device } = useContext(Context);

    return (
        <div className="filter-section">
            <h4 className="filter-title">Категории</h4>
            <ul className="category-list">
                <li
                    className={`category-list-item ${!device.selectedType.id ? 'active' : ''}`}
                    onClick={() => device.setSelectedType({})}
                >
                    Все категории
                </li>
                {device.types.map(type =>
                    <li
                        key={type.id}
                        className={`category-list-item ${type.id === device.selectedType.id ? 'active' : ''}`}
                        onClick={() => device.setSelectedType(type)}
                    >
                        {type.name}
                    </li>
                )}
            </ul>
        </div>
    );
});

export default TypeBar;