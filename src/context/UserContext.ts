import {createContext} from "react";
import User from "../model/User";

export const UserContext = createContext<UserContext>({
    user: null,
    setUser: (user: User) => {}
});

export interface UserContext {
    user: User | null;
    setUser: (user: User) => void;
}
