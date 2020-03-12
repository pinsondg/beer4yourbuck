import {CalculationItemInput} from "../modal/BeerAddModal";

export interface CustomInput {
    onFocus?: (inputItem: CalculationItemInput) => void;
    focused?: boolean;
}