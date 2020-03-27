import {createContext} from "react";
import {Beer} from "../model/Beer";


export const CompareBeerContext = createContext<CompareBeerContextData>({compareBeers: [], setCompareBeers: () => {}});

export interface CompareBeerContextData {
    compareBeers: Beer[]
    setCompareBeers: (beers: Beer[]) => void;
}