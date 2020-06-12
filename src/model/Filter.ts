export interface Filter {
    type: FilterType
    value: string | number
    displayValue: string
}

export enum FilterType {
    MAX_PRICE, DISTANCE, VENUE_TYPE, BEER_TYPE
}