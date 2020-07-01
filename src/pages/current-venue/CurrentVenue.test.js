import React from "react";
import CurrentVenue, {formatDaysOfWeek} from "./CurrentVenue";
import {fireEvent, render} from "@testing-library/react";
import {BeerVenueContext} from '../../context/BeerVenueContext';
import {UserContext} from "../../context/UserContext";
import {DateTime} from "luxon";
import {NotificationContext} from "../../context/NotificationContext";
import {UserType} from "../../model/User";

describe('formatDaysOfWeek should show correct days', () => {
    it('should show "MON-WED, SAT"', function () {
        expect(formatDaysOfWeek(["MONDAY", "TUESDAY", "WEDNESDAY", "SATURDAY"])).toEqual("MON-WED, SAT");
    });
    it('should show "MON, WED, FRI"', function () {
        expect(formatDaysOfWeek(["MONDAY", "WEDNESDAY", "FRIDAY"])).toEqual("MON, WED, FRI");
    });
    it('should show "MON, TUE, THU"', function () {
        expect(formatDaysOfWeek(["MONDAY", "TUESDAY", "THURSDAY"])).toEqual("MON, TUE, THU");
    });
    it('should show "SUN-SAT"', function () {
        expect(formatDaysOfWeek(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"])).toEqual("SUN-SAT");
    });
    it('should show "MON-THU, SAT"', function () {
        expect(formatDaysOfWeek(["WEDNESDAY", "MONDAY", "THURSDAY", "TUESDAY", "SATURDAY"])).toEqual("MON-THU, SAT");
    });
    it('should show "SUN-TUE, THU-SAT"', function () {
        expect(formatDaysOfWeek(["SUNDAY", "MONDAY", "TUESDAY", "THURSDAY", "FRIDAY", 'SATURDAY'])).toEqual("SUN-TUE, THU-SAT");
    });
    it('should show "SUN, THU-SAT"', function () {
        expect(formatDaysOfWeek(["SUNDAY", "THURSDAY", "FRIDAY", "SATURDAY"])).toEqual("SUN, THU-SAT");
    });
});

const mockNotificationContext = {
    notifications: [],
    setNotifications: jest.fn()
};

const mockVenueContextNoBeer = {
    venue: {
        id: '123',
        name: 'Test Venue',
        beers: [],
        lat: 12.5,
        lon: 13.6,
        address: '1234 TEST Rd',
        venueTypes: ['BREWERY'],
        happyHourDayOfWeek: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
        happyHourEnd: DateTime.local().plus({hours: 1}).toISOTime(),
        happyHourStart: DateTime.local().minus({hours: 1}).toISOTime()
    },
    setVenue: (x) => console.log(x)
};

const mockVenueContextNoHappyHour = {
    venue: {
        id: '123',
        name: 'Test Venue',
        beers: [],
        lat: 12.5,
        lon: 13.6,
        address: '1234 TEST Rd',
        venueTypes: ['BREWERY']
    },
    setVenue: (x) => console.log(x)
};

const mockUserContext = {
    user: {
        username: 'dannyP',
        email: 'test@test.com',
        type: UserType.PATRON
    },
    setUser: () => console.log("Set user.")
};

describe('Current Venue happy hour set and no user', () => {
    const mockVenueContext = mockVenueContextNoBeer;

    let helpers;

    beforeEach(async () => {
        helpers = render(
            <NotificationContext.Provider value={mockNotificationContext}>
                <UserContext.Provider value={{user: null, setUser: jest.fn()}}>
                    <BeerVenueContext.Provider value={mockVenueContext}>
                        <CurrentVenue/>
                    </BeerVenueContext.Provider>
                </UserContext.Provider>
            </NotificationContext.Provider>
        );
    });

    it('should show correct venue name', function () {
        helpers.getByText('Test Venue');
    });

    it('should show correct venue type', function () {
        helpers.getByText('BREWERY')
    });

    it('should show registration modal when add clicked', function () {
        const addBeerButton = helpers.getByText(/Add Beer/i);
        fireEvent.click(addBeerButton);
        helpers.getByText('Log in or Sign Up to Perform This Action!')
    });

    it('should show correct happy hour times', function () {
        const expectedHappyHourTime = `Happy Hour: ${DateTime.local().minus({hours: 1}).toLocaleString(DateTime.TIME_SIMPLE)}-${DateTime.local().plus({hours: 1}).toLocaleString(DateTime.TIME_SIMPLE)} SUN-SAT`
        helpers.getByText(expectedHappyHourTime);
    });
});

describe('Current Venue happy hour not set and user', () => {
    const mockVenueContext = mockVenueContextNoHappyHour;

    let helpers;

    beforeEach(async () => {
        helpers = render(
            <NotificationContext.Provider value={mockNotificationContext}>
                <UserContext.Provider value={mockUserContext}>
                    <BeerVenueContext.Provider value={mockVenueContext}>
                        <CurrentVenue/>
                    </BeerVenueContext.Provider>
                </UserContext.Provider>
            </NotificationContext.Provider>
        );
    });

    it('should show choose time modal when report clicked', function () {
        const reportButton = helpers.getByText('Click to report');
        fireEvent.click(reportButton);
        helpers.getByText('Select Happy Hour Time')
    });
});