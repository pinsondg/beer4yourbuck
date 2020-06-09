import {createContext, Dispatch} from "react";
import {Filter, FilterType} from "../model/Filter";

let filterIdCount = 0;

export const NearYouFilterContext = createContext<NearYouFilterContextData>({
    filters: [],
    filterDispatch: () => {}
});

export interface NearYouFilterContextData {
    filters: ActiveFilter[];
    filterDispatch: Dispatch<FilterChangeAction>;
}

export type FilterChangeAction =
    | {type: 'add', filter: Filter}
    | {type: 'remove', filterId: number};

export function filterReducer(state: ActiveFilter[], action: FilterChangeAction) {
    switch (action.type) {
        case "add":
            return [...state, {filterId: filterIdCount++, filter: action.filter}];
        case "remove":
            return state.filter(x => x.filterId !== action.filterId);
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
