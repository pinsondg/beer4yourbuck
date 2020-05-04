import {createContext} from "react";
import User from "../model/User";

export const UserContext = createContext<UserContext>({
    user: null,
    setUser: (user: User | null) => {}
});

export interface UserContext {
    user: User | null;
    setUser: (user: User | null) => void;
}
