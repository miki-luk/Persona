// --- START OF FILE client/src/components/account/UserProfile.js ---
import React, { useContext } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';

const UserProfile = observer(() => {
    const { user } = useContext(Context);

    return (
        <div>
            <h2>Профиль</h2>
            <Card className="mt-3">
                <Card.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={user.user.email} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Роль</Form.Label>
                            <Form.Control type="text" value={user.user.role} disabled />
                        </Form.Group>
                        <Button variant="dark" disabled>Сменить пароль (в разработке)</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
});

export default UserProfile;
// --- END OF FILE client/src/components/account/UserProfile.js ---