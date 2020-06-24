export interface Filter {
    type: FilterType
    value: string | number
    displayValue: string
}

export enum FilterType {
    MAX_PRICE = 'Max Price', DISTANCE = 'Distance', VENUE_TYPE = 'Venue Type', BEER_TYPE = 'Beer Type', COUNT = 'Count'
}