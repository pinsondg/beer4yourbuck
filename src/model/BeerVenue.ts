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
}

/**
 * Represents any place that serves beer (i.e. Brewery, Restaurant)
 */
export interface BeerVenue {
    id: string;
    name: string;
    beers: Array<Beer>;
    lat: number;
    lon: number;
    address: string;
    venueTypes: string[];
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

export interface GooglePlace {
    formattedAddress: string;
    name: string;
    placeId: string;
    vicinity: string;
}