import {createContext, Dispatch} from "react";
import {Filter, FilterType} from "../model/Filter";

let filterIdCount = 0;

export interface NearYouFilterContextData {
    filters: ActiveFilter[];
    filterDispatch: Dispatch<FilterChangeAction>;
}

export type FilterChangeAction =
    | {type: 'add', filter: Filter}
    | {type: 'remove', filterId: number}
    | {type: 'clear'};

export function filterReducer(state: ActiveFilter[], action: FilterChangeAction) {
    switch (action.type) {
        case "add":
            if (!state.some(filter => filter.filter.value === action.filter.value)) {
                return [...state, {filterId: filterIdCount++, filter: action.filter}];
            } else {
                return state;
            }
        case "remove":
            return state.filter(x => x.filterId !== action.filterId);
        case "clear":
            return state.filter(x => x.filter.type === FilterType.DISTANCE);
    }
}

export const initialFilters: ActiveFilter[] =
    [{
        filterId: filterIdCount++,
        filter: {
            type: FilterType.DISTANCE,
            value: 5,
            displayValue: 'Distance: 5 miles'
        }
    }];

export interface ActiveFilter {
    filterId: number;
    filter: Filter
}

export const NearYouFilterContext = createContext<NearYouFilterContextData>({
    filters: [],
    filterDispatch: () => {}
});
