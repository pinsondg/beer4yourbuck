import {createContext} from "react";
import User from "../model/User";

export enum LoginStatus {
    LOGGED_IN = "Logged in", LOGGED_OUT = "Logged out", LOGGING_IN = "Logging in", LOGIN_FAILURE  = "Login failure"
}

export const UserContext = createContext<UserContext>({
    user: null,
    setUser: (user: User | null) => {},
    loginStatus: LoginStatus.LOGGED_IN,
    setLoginStatus: (status: LoginStatus) => {}
});

export interface UserContext {
    user: User | null;
    setUser: (user: User | null) => void;
    loginStatus: LoginStatus;
    setLoginStatus: (status: LoginStatus) => void;
}
