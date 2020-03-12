/**
 * Represents a beer.
 */
export interface Beer {
    name?: string;
    id?: string;
    nameDisplay?: string;
    description?: string;
    abv?: string;
    isRetired?: string;
    labels?: BeerIconLabels;
    price?: number
    volume?: number
    ottawayScore?: number
}

/**
 * Contains links to a beer icon/label image.
 */
export interface BeerIconLabels {
    icon?: string;
    medium?: string;
    large?: string;
    contentAwareIcon?: string;
    contentAwareMedium?: string;
    contentAwareLarge?: string;
}