import {CalculationItemInput} from "../modal/beerAdd/BeerAddModal";

export interface CustomInput {
    onFocus?: (inputItem: CalculationItemInput) => void;
    focused?: boolean;
}