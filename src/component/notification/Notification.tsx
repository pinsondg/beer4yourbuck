import React, {ReactNode, useEffect, useState} from "react";
import {Alert, Col, Container, Row} from "reactstrap";
import {Notification, NotificationType} from "../../context/NotificationContext";
import classNames from "classnames";
import './notification.css'
import {MdCheckCircle, MdClose, MdError, MdInfo, MdWarning} from "react-icons/md";
import {isMobile} from "../../controller/Utils";

interface NotificationProps {
    notification: Notification;
    onClose: () => void;
}

interface NotificationTpeProperties {
    icon: ReactNode;
    color: string;
}

export default function NotificationComponent(props: NotificationProps) {
    const [typeProperties, setTypeProperties] = useState<NotificationTpeProperties>({icon: <MdInfo/>, color: 'primary'});

    const onClick = () => {
        if (props.notification.action) {
            props.notification.action();
            props.onClose();
        }
    };

    const onCloseClick = (event: React.MouseEvent) => {
        props.onClose();
        event.stopPropagation();
    };

    const notificationClass = classNames('notification', {
        'clickable' : props.notification.action,
        'mobile' : isMobile()
    });

    useEffect(() => {
        const iconSize = 50;
        switch (props.notification.type) {
            case NotificationType.ACTION:
            case NotificationType.INFO:
                setTypeProperties({
                    icon: <MdInfo size={iconSize}/>,
                    color: 'primary'
                });
                break;
            case NotificationType.ERROR:
                setTypeProperties({
                    icon: <MdError size={iconSize}/>,
                    color: 'danger'
                });
                break;
            case NotificationType.WARNING:
                setTypeProperties({
                    icon: <MdWarning size={iconSize}/>,
                    color: 'warning'
                });
                break;
            case NotificationType.SUCCESS:
                setTypeProperties({
                    icon: <MdCheckCircle size={iconSize}/>,
                    color: 'success'
                })
        }
    }, [props.notification.type]);

    return (
        <Alert className={notificationClass} color={typeProperties.color} onClick={onClick}>
            <Container fluid={true}>
                <Row style={{alignItems: 'center'}}>
                    <Col sm={2}>
                        {typeProperties.icon}
                    </Col>
                    <Col sm={10} style={{textAlign: 'left', fontSize: '14px'}}>
                        <h6>{props.notification.title}</h6>
                        {props.notification.message}
                    </Col>
                    {/*<Col sm={4} lg={2}>*/}
                    {/*    <Button style={{fontSize: '14px'}} className={'dismiss-button'} onClick={onCloseClick}>Dismiss</Button>*/}
                    {/*</Col>*/}
                </Row>
                <div onClick={onCloseClick} className={'close-button'}>
                    <MdClose size={25}/>
                </div>
            </Container>
        </Alert>
    )
}