import React, { useContext, useEffect } from 'react';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import { Container, Nav } from 'react-bootstrap';
import { fetchDepartments } from '../http/deviceAPI';
import './DepartmentNav.css';

const DepartmentNav = observer(() => {
    const { device } = useContext(Context);

    useEffect(() => {
        // Просто загружаем отделы при первом рендере, если их нет
        if (device.departments.length === 0) {
            fetchDepartments().then(data => device.setDepartments(data));
        }
    }, [device]);

    const selectDepartment = (department) => {
        device.setSelectedDepartment(department);
    };
    
    return (
        <div className="department-nav-wrapper">
            <Container>
                <Nav className="justify-content-center">
                    {device.departments.map(d =>
                        <Nav.Item key={d.id}>
                            <Nav.Link
                                active={device.selectedDepartment.id === d.id}
                                onClick={() => selectDepartment(d)}
                            >
                                {d.name}
                            </Nav.Link>
                        </Nav.Item>
                    )}
                </Nav>
            </Container>
        </div>
    );
});

export default DepartmentNav;