import {createContext} from "react";

export interface Notification {
    title: string;
    message: string;
    action?: () => void;
    type: NotificationType;
    timeout?: number
}

export enum NotificationType {
    INFO, ACTION, ERROR, WARNING
}

export const NotificationContext = createContext<NotificationContext>({notifications: [], setNotifications: () => {}});

export interface NotificationContext {
    notifications: Notification[];
    setNotifications: (notifications: Notification[]) => void;
}