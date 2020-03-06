import {Beer} from "./Beer";

/**
 * Represents a brewery.
 */
export interface Brewery extends BeerVenue {
    displayName: string;
    nameShortDisplay: string;
    isVerified: boolean;
    description: string;
    website: string;
    established: string;
    mailingListUrl: string;
    isOrganic: boolean;
    beers?: Array<Beer>
}

/**
 * Represents any place that serves beer (i.e. Brewery, Restaurant)
 */
export interface BeerVenue {
    id: string
    name: string
}

/**
 * Location data of a specific venue.
 */
export interface VenueLocationInfo<T extends BeerVenue> {
    venue: T;
    streetAddress: string;
    latitude: number;
    longitude: number;
}