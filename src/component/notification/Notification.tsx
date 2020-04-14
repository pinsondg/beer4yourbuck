import React, {ReactNode, useEffect, useState} from "react";
import {Alert, Button} from "reactstrap";
import {Notification, NotificationType} from "../../context/NotificationContext";
import classNames from "classnames";
import './notification.css'
import {MdError, MdInfo, MdWarning} from "react-icons/all";

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
        }
    }, [props.notification.type]);

    return (
        <Alert className={notificationClass} color={typeProperties.color} onClick={onClick}>
            <div className={'icon-holder'}>
                {typeProperties.icon}
            </div>
            <div className={'text-holder'}>
                <h6>{props.notification.title}</h6>
                <p>{props.notification.message}</p>
            </div>
            <Button className={'dismiss-button'} onClick={onCloseClick}>Dismiss</Button>
        </Alert>
    )
}