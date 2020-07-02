import React from "react";
import {render} from "@testing-library/react";
import {NotificationContext} from "../../context/NotificationContext";
import {UserContext} from "../../context/UserContext";
import {filterReducer, initialFilters, NearYouFilterContext,} from "../../context/NearYouFilterContext";
import {NearYouPage} from "./NearYouPage";
import {NearYouVenuesContext} from "../../context/NearYouVenuesContext";
import {FilterType} from "../../model/Filter";
import {MockVenue_goodData__Tugwells, MockVenue_goodData_StickyRice} from "../../mocks/MockBeerVenues";

describe('Near You Page Filters Test', () => {

    const getTreeWithAttributes = (mockFilterContext, venues) => {
        return render(
            <NotificationContext.Provider value={jest.fn()}>
                <UserContext.Provider value={{user: null, setUser: jest.fn()}}>
                    <NearYouFilterContext.Provider value={mockFilterContext}>
                        <NearYouVenuesContext.Provider value={{nearYouVenues: {state: venues}, nearYouVenueDispatch: jest.fn()}}>
                            <NearYouPage/>
                        </NearYouVenuesContext.Provider>
                    </NearYouFilterContext.Provider>
                </UserContext.Provider>
            </NotificationContext.Provider>
        )
    };

    it('should only show store venues when store filter is active', async () => {
        const filters = [{
            filterId: 1,
            filter: {
                type: FilterType.VENUE_TYPE,
                value: 'STORE',
                displayValue: 'Venue Type: Store'
            }
        }];
        const helpers = getTreeWithAttributes({
            filters: [...initialFilters, ...filters],
            filterReducer: filterReducer
        }, [MockVenue_goodData_StickyRice, MockVenue_goodData__Tugwells]);
        expect(helpers.getByText(/result/i)).toHaveTextContent('3 results');
    });

    // it('should only show store venues when store filter is active', async () => {
    //
    // });
});