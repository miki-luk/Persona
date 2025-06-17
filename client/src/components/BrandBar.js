import React, { useContext } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../index";

const BrandBar = observer(() => {
    const { device } = useContext(Context);

    return (
        <div className="filter-section">
            <h4 className="filter-title">Бренды</h4>
            <div className="brand-pills-container">
                <div
                    className={`brand-pill ${!device.selectedBrand.id ? 'active' : ''}`}
                    onClick={() => device.setSelectedBrand({})}
                >
                    Все бренды
                </div>
                {device.brands.map(brand =>
                    <div
                        key={brand.id}
                        className={`brand-pill ${brand.id === device.selectedBrand.id ? 'active' : ''}`}
                        onClick={() => device.setSelectedBrand(brand)}
                    >
                        {brand.name}
                    </div>
                )}
            </div>
        </div>
    );
});

export default BrandBar;