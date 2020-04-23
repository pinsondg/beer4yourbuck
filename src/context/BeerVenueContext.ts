import {createContext} from 'react'
import {BeerVenue} from "../model/BeerVenue";

export const BeerVenueContext = createContext<BeerVenueContextData>({setVenue: () => {}});

export interface BeerVenueContextData {
    venue?: BeerVenue;
    setVenue: (venue: BeerVenue) => void;
}