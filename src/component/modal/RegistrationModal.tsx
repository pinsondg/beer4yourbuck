import React, {useState} from "react";
import {Button, Col, Container, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {useHistory} from "react-router-dom";

interface Props {
    message?: string;
    show: boolean
    onClose: () => void;
}

export default function RegistrationModal(props: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const history = useHistory();

    const onRegister = () => {
        history.push('/register');
        close();
    };

    const onLogin = () => {
        history.push('/login');
        close();
    };

    const close = () => {
        setIsOpen(false);
        props.onClose();
    };

    return (
        <Modal isOpen={isOpen} toggle={close}>
            <ModalHeader toggle={close}>
                Log in or Sign Up to Perform This Action!
            </ModalHeader>
            <ModalBody>
                <Container>
                    <Row>
                        <Col>
                            {props.message}
                        </Col>
                    </Row>
                    <hr/>
                    <Row className={'align-items-center'}>
                        <Col xs={6} style={{display: 'flex'}} sm={{offset: 2, size: 4}}>
                            <Button style={{margin: '0 auto'}} onClick={onLogin}>Login</Button>
                        </Col>
                        <Col xs={6} style={{display: "flex"}} className={'align-items-center'} sm={4}>
                            <Button style={{margin: '0 auto'}} color={'primary'} onClick={onRegister}>Register</Button>
                        </Col>
                    </Row>
                </Container>
            </ModalBody>
        </Modal>
    )
}