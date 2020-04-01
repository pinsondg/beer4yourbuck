import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";

interface ConformationModalProps {
    header?: string;
    text?: string;
    onYes?: () => void;
    onNo?: () => void;
    show: boolean
    onClose: () => void;
}

export function ConformationModal(props: ConformationModalProps) {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const header = props.header ? props.header : "Confirm";
    const text = props.text ? props.text : "Are you sure you want to perform this action?";

    useEffect(() => {
        setIsOpen(props.show)
    }, [props]);

    const onNoSelect = () => {
        if (props.onNo) {
            props.onNo();
        }
        close()
    };

    const onYesSelect = () => {
        if (props.onYes) {
            props.onYes();
        }
        close()
    };

    const toggle = () => {
        setIsOpen(!isOpen);
        if (props.onClose) {
            props.onClose();
        }
    };

    const close = () => {
        setIsOpen(false);
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>{header}</ModalHeader>
            <ModalBody>
                {text}
            </ModalBody>
            <ModalFooter>
                <Button onClick={onYesSelect} color={'danger'}>Yes</Button>
                <Button onClick={onNoSelect} color={'primary'}>No</Button>
            </ModalFooter>
        </Modal>
    )
}