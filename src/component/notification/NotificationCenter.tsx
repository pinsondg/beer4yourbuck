import React, {useContext, useEffect, useState} from "react";
import {Notification, NotificationContext} from "../../context/NotificationContext";
import NotificationComponent from "./NotificationComponent";
import classNames from "classnames";

export default function NotificationCenter() {
    const {notifications, setNotifications} = useContext(NotificationContext);
    const [active, setActive] = useState<Notification | null>();
    const [timeoutId, setTimeoutId] = useState<number | null>(null);

    useEffect(() => {
        if (JSON.stringify(notifications[0]) !== JSON.stringify(active)) {
            setActive(notifications[0]);
        }
    }, [notifications, active]);

    //Filter out duplicate notifications
    useEffect(() => {
        const uniqueArray = notifications.filter((notification, index) => {
            const _thing = JSON.stringify(notification);
            return index === notifications.findIndex(obj => {
                return JSON.stringify(obj) === _thing;
            });
        });
        if (JSON.stringify(uniqueArray) !== JSON.stringify(notifications)) {
            setNotifications(uniqueArray);
        }
    }, [notifications, setNotifications]);

    const getNext = () => {
        if (notifications.length > 0) {
            const newNotifications = notifications.slice(1, notifications.length);
            if (timeoutId) {
                clearTimeout(timeoutId);
                setTimeoutId(null);
            }
            setNotifications(newNotifications);
        }
    };

    useEffect(() => {
        if (notifications.length > 0 && notifications[0].timeout) {
            if (!timeoutId) {
                setTimeoutId(setTimeout(() => {
                    if (notifications.length > 0) {
                        const newNotifications = notifications.slice(1, notifications.length);
                        setNotifications(newNotifications);
                    }
                }, notifications[0].timeout))
            }
        }
    }, [notifications, setNotifications, timeoutId]);

    const notificationCenterClasses = classNames('notification-center', {
        'hidden': notifications.length === 0,
        'active': notifications.length > 0
    });

    return (
        <div className={notificationCenterClasses}>
            {active && <NotificationComponent notification={active} onClose={getNext}/>}
        </div>
    )
}