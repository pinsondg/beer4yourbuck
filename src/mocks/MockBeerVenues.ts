import {BeerVenue} from "../model/BeerVenue";
import {
    goldenMonkey_untappedData_isHappyHour,
    mockBudLight_12Pack_untappedData,
    mockBudLight_untappedData,
    mockBudLightLime_untappedData_isHappyHour,
    mockBudweiser_noUntappedData,
    mockBudweiser_untappedData
} from "./MockBeers";

export const MockVenue_goodData_Social52: BeerVenue = {
    id: "2",
    name: 'Social 52',
    venueTypes: ['BAR'],
    lat: 37.552163,
    lon: -77.474225,
    address: '2619 W Main St, Richmond, VA 23220',
    beers: [mockBudLight_untappedData, mockBudweiser_untappedData]
};

export const MockVenue_goodData_StickyRice: BeerVenue = {
    id: '3',
    name: 'Sticky Rice',
    venueTypes: ['RESTAURANT', 'BAR'],
    lat: 37.550546,
    lon: -77.469425,
    address: '2232 W Main St, Richmond, VA 23220',
    beers: [mockBudLightLime_untappedData_isHappyHour, mockBudweiser_untappedData, goldenMonkey_untappedData_isHappyHour]
};

export const MockVenue_goodData__Tugwells: BeerVenue = {
    id: '4',
    name: 'Tugwells Market',
    venueTypes: ['STORE'],
    lat: 37.550470,
    lon: -77.473172,
    address: '2533 W Cary St, Richmond, VA 23220',
    beers: [mockBudLight_12Pack_untappedData, mockBudLight_untappedData, mockBudweiser_noUntappedData]
};