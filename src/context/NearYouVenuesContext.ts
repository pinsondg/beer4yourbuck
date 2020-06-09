import {createContext} from "react";
import {BeerVenue} from "../model/BeerVenue";


export const NearYouVenuesContext = createContext<NearYouVenuesContextData>({
    nearYouVenues: null,
    setNearYouVenues: () => {}
});

export interface NearYouVenuesContextData {
    nearYouVenues: BeerVenue[] | null;
    setNearYouVenues: (venues: BeerVenue[]) => void;
}