import {createContext, Dispatch} from "react";
import {BeerVenue} from "../model/BeerVenue";
import Beer4YourBuckAPI from "../controller/api/Beer4YourBuckAPI";
import {AsyncState} from "../controller/hooks/AsyncReducerHook";

const api = Beer4YourBuckAPI.getInstance();

export type NearYouVenuesContextAction =
    | {type: 'refresh', coords: Coordinates, radius: number}
    | {type: 'set', venues: AsyncState<BeerVenue[]>}
    | {type: 'clear'}
    | {type: 'add', venues: AsyncState<BeerVenue[]>}
    | {type: 'remove', venueId: string}
    | {type: 'clearError'};

export async function nearYouVenuesReducer(state: AsyncState<BeerVenue[] | null>, action: NearYouVenuesContextAction): Promise<AsyncState<BeerVenue[] | null>> {
    switch (action.type) {
        case "add":
            return {
                state: state.state,
            };
        case "clear":
            return {state: null, error: undefined};
        case "refresh":
            const newVenues = api.getVenuesNearYou(action.coords.latitude, action.coords.longitude, action.radius);
            const data = await newVenues;
            return {
                state: data.data,
                error: undefined
            };
        case "set":
            return action.venues;
        case "remove":
            return {state: state.state ? state.state.filter(x => x.id !== action.venueId) : null};
        default:
            console.log(`Setting state to: ${JSON.stringify(state)}`);
            return state;
    }
}

export const NearYouVenuesContext = createContext<NearYouVenuesContextData>({
    nearYouVenues: {state: null},
    nearYouVenueDispatch: () => {}
});

export interface NearYouVenuesContextData {
    nearYouVenues: AsyncState<BeerVenue[] | null>;
    nearYouVenueDispatch: Dispatch<NearYouVenuesContextAction>
}