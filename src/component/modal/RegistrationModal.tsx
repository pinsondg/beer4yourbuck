import React, {useState} from "react";
import {Col, Container, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {useHistory} from "react-router-dom";
import {Beer4YourBuckBtn, BtnType} from "../button/custom-btns/ThemedButtons";

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
                            <Beer4YourBuckBtn customStyle={BtnType.PRIMARY_CLEAR} style={{margin: '0 auto'}} onClick={onLogin}>Login</Beer4YourBuckBtn>
                        </Col>
                        <Col xs={6} style={{display: "flex"}} className={'align-items-center'} sm={4}>
                            <Beer4YourBuckBtn customStyle={BtnType.SECONDARY} style={{margin: '0 auto'}} color={'primary'} onClick={onRegister}>Register</Beer4YourBuckBtn>
                        </Col>
                    </Row>
                </Container>
            </ModalBody>
        </Modal>
    )
}