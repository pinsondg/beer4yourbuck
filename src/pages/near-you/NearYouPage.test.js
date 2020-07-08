import React from "react";
import {fireEvent, render} from "@testing-library/react";
import {NotificationContext} from "../../context/NotificationContext";
import {UserContext} from "../../context/UserContext";
import {filterReducer, initialFilters, NearYouFilterContext,} from "../../context/NearYouFilterContext";
import {NearYouPage} from "./NearYouPage";
import {NearYouVenuesContext} from "../../context/NearYouVenuesContext";
import {FilterType} from "../../model/Filter";
import {
    MockVenue_goodData__Tugwells,
    MockVenue_goodData_Social52,
    MockVenue_goodData_StickyRice
} from "../../mocks/MockBeerVenues";
import {Route, Router, Switch} from "react-router-dom";
import {createMemoryHistory} from "history";

describe('Near You Page Filters Test', () => {

    const getTreeWithAttributes = (mockFilterContext, venues) => {
        const history = createMemoryHistory('/near-you');
        return render(
            <Router history={history}>
                <Switch>
                    <Route>
                        <NotificationContext.Provider value={jest.fn()}>
                            <UserContext.Provider value={{user: null, setUser: jest.fn()}}>
                                <NearYouFilterContext.Provider value={mockFilterContext}>
                                    <NearYouVenuesContext.Provider value={{nearYouVenues: {state: venues}, nearYouVenueDispatch: jest.fn()}}>
                                        <NearYouPage/>
                                    </NearYouVenuesContext.Provider>
                                </NearYouFilterContext.Provider>
                            </UserContext.Provider>
                        </NotificationContext.Provider>
                    </Route>
                </Switch>
            </Router>

        )
    };

    it('should open filter menu when filters button is clicked', () => {
        const helpers = getTreeWithAttributes({
            filters: [...initialFilters],
            filterReducer: filterReducer
        }, [MockVenue_goodData_StickyRice, MockVenue_goodData__Tugwells]);
        expect(helpers.getByTestId("popover-menu")).toHaveClass('closed');
        const filterButton = helpers.getByText(/filters/i);
        expect(filterButton).toHaveTextContent("Filters (1)");
        fireEvent.click(filterButton);
        expect(helpers.getByTestId("popover-menu")).not.toHaveClass('closed');
    });

    it('filter menu should have all filter types', () => {
        const helpers = getTreeWithAttributes({
            filters: [...initialFilters],
            filterReducer: filterReducer
        }, [MockVenue_goodData_StickyRice, MockVenue_goodData__Tugwells]);
        expect(helpers.getByText("Distance")).toHaveTextContent("Distance");
        expect(helpers.getByText("Max Price")).toHaveTextContent("Max Price");
        expect(helpers.getByText("Venue Type")).toHaveTextContent("Venue Type");
        expect(helpers.getByText("Beer Type")).toHaveTextContent("Beer Type");
        expect(helpers.getByText("Count")).toHaveTextContent("Count");
    });

    it('beer type filter should show correct sub filters', () => {
        const helpers = getTreeWithAttributes({
            filters: [...initialFilters],
            filterReducer: filterReducer
        }, [MockVenue_goodData_StickyRice, MockVenue_goodData__Tugwells, MockVenue_goodData_Social52]);
        const dropdown = helpers.getByText("Beer Type");
        fireEvent.click(dropdown);
        helpers.debug(dropdown);
        expect(helpers.getByText(/Lager/i)).toHaveTextContent("Lager");
        expect(helpers.getByText('American Light')).toHaveTextContent("American Light");
        expect(helpers.getByText('American')).toHaveTextContent('American');
        expect(helpers.getByText('Pilsner')).toHaveTextContent('Pilsner');
    });

    it('should only show store venues when store filter is active', () => {
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
        const filterButton = helpers.getByText(/filters/i);
        expect(filterButton).toHaveTextContent("Filters (2)");
        expect(helpers.getByText(/result/i)).toHaveTextContent('3 results');
    });

    it('should show beers with correct count when count filter is active', () => {
        const filters = [{
            filterId: 3,
            filter: {
                type: FilterType.COUNT,
                value: 12,
                displayValue: 'Count: 12'
            }
        }];
        const helpers = getTreeWithAttributes({
            filters: [...initialFilters, ...filters],
            filterReducer: filterReducer
        }, [MockVenue_goodData_StickyRice, MockVenue_goodData__Tugwells]);
        const filterButton = helpers.getByText(/filters/i);
        expect(filterButton).toHaveTextContent("Filters (2)");
        expect(helpers.getByText(/result/i)).toHaveTextContent('1 result');
    });

    it('should show beers with max price when max price is active', () => {
        const filters = [{
            filterId: 3,
            filter: {
                type: FilterType.MAX_PRICE,
                value: 6,
                displayValue: 'Max Price: $6.00'
            }
        }];
        const helpers = getTreeWithAttributes({
            filters: [...initialFilters, ...filters],
            filterReducer: filterReducer
        }, [MockVenue_goodData__Tugwells]);
        const filterButton = helpers.getByText(/filters/i);
        expect(filterButton).toHaveTextContent("Filters (2)");
        expect(helpers.getByText(/result/i)).toHaveTextContent('2 results');
    });

    it('should show beers with correct type when type filter is active', () => {
        const filters = [{
            filterId: 3,
            filter: {
                type: FilterType.BEER_TYPE,
                value: 'Lager - American Light',
                displayValue: 'Beer Type: Lager'
            }
        }];
        const helpers = getTreeWithAttributes({
            filters: [...initialFilters, ...filters],
            filterReducer: filterReducer
        }, [MockVenue_goodData_StickyRice]);
        const filterButton = helpers.getByText(/filters/i);
        expect(filterButton).toHaveTextContent("Filters (2)");
        expect(helpers.getByText(/result/i)).toHaveTextContent('1 result');
    });

    it('should show correct search results',() => {
        const helpers = getTreeWithAttributes({
            filters: initialFilters,
            filterReducer: filterReducer
        }, [MockVenue_goodData_StickyRice, MockVenue_goodData__Tugwells]);
        const searchBar = helpers.getByPlaceholderText("Search beer/venue");
        fireEvent.change(searchBar, {target: {value: 'Bud Light'}});
        expect(helpers.getByText(/result/i)).toHaveTextContent("3 results");
        fireEvent.change(searchBar, {target: {value: 'Budweiser'}});
        expect(helpers.getByText(/result/i)).toHaveTextContent("2 results");
        fireEvent.change(searchBar, {target: {value: 'tugwells'}});
        expect(helpers.getByText(/result/i)).toHaveTextContent("3 results");
    });
});