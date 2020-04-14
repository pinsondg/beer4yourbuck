import React, {useContext, useEffect, useState} from "react";
import {Notification, NotificationContext} from "../../context/NotificationContext";
import {Collapse} from "reactstrap";
import NotificationComponent from "./Notification";

export default function NotificationCenter() {
    const {notifications, setNotifications} = useContext(NotificationContext);
    const [active, setActive] = useState<Notification | null>();

    useEffect(() => {
        if (JSON.stringify(notifications[0]) !== JSON.stringify(active)) {
            setActive(notifications[0]);
        }
    }, [notifications, active]);

    const getNext = () => {
        if (notifications.length > 0) {
            const newNotifications = notifications.slice(1, notifications.length);
            setNotifications(newNotifications);
        }
    };

    useEffect(() => {
        if (notifications.length > 0 && notifications[0].timeout) {
            setTimeout(() => {
                if (notifications.length > 0) {
                    const newNotifications = notifications.slice(1, notifications.length);
                    setNotifications(newNotifications);
                }
            }, notifications[0].timeout)
        }
    }, [notifications, setNotifications]);

    return (
        <Collapse isOpen={notifications.length > 0}>
            {active && <NotificationComponent notification={active} onClose={getNext}/>}
        </Collapse>
    )
}