import {CalculationItemInput} from "../../flows/multicompare/CalculationItem";

export interface CustomInput {
    onFocus?: (inputItem: CalculationItemInput) => void;
    focused?: boolean;
}