import {createContext, RefObject} from "react";

export const CurrentContentRef = createContext<ContentRef>({setContentRef: () => {}});

export interface ContentRef {
    contentRef?: RefObject<HTMLDivElement>;
    setContentRef: (ref: RefObject<HTMLDivElement>) => void;
}