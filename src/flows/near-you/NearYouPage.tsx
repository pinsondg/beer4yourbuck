import React, {ReactNode, useContext, useEffect, useState} from "react";
import {LocationNearYouBrick} from "../../component/brick/LocationNearYouBrick";
import {BeerVenue} from "../../model/BeerVenue";
import {Nav, NavItem, NavLink} from "reactstrap";
import './near-you-page.css'
import {Beer} from "../../model/Beer";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";
import {getDistance, getLocation, metersToMiles} from "../../controller/LocationController";
import {LoadingSpinner} from "../../component/load/LoadSpinner";
import {BeerNearYouBrick} from "../../component/brick/BeerNearYouBrick";
import {NotificationContext, NotificationType} from "../../context/NotificationContext";

enum Mode {
    LOCATION, BEER
}

let key = 0;

const mockVenue: BeerVenue = {
    id: "1",
    beers: [new Beer.Builder().withVolume(5.0).withAbv("6.0").withId("2").withName("Bud Light").withPrice(4.0).build()],
    lat: 37.87604,
    lon: -77.98573,
    name: "Sticky Rice",
    venueType: "BREWERY",
    address: "1234 Something Rd."
};

export function NearYouPage() {
    const [venues, setVenues] = useState<BeerVenue[]>([]);
    const [mode, setMode] = useState<Mode>(Mode.LOCATION);
    const [currPos, setCurrPos] = useState<Position>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {notifications, setNotifications} = useContext(NotificationContext);

    const getNearYouLocationBricks = (): ReactNode => {
        return [...venues].sort((venue1, venue2)=> {
            let distance1 = 0;
            let distance2 = 0;
            if (currPos) {
                distance1 = metersToMiles(getDistance(venue1.lat, venue1.lon, currPos.coords.latitude, currPos.coords.longitude));
                distance2 = metersToMiles(getDistance(venue2.lat, venue2.lon, currPos.coords.latitude, currPos.coords.longitude));
            }
            return distance1 - distance2;
        }).filter(venue => venue.beers.length > 0).map(venue => {
            let distance = 0;
            if (currPos) {
                distance = metersToMiles(getDistance(venue.lat, venue.lon, currPos.coords.latitude, currPos.coords.longitude));
            }
            return (
                <LocationNearYouBrick key={key++} distance={distance} venue={venue}/>
            )
        });
    };

    const getNearYouBeerBricks = (): ReactNode => {
        let beers: {beer: Beer, venue: BeerVenue}[] = [];
        venues.forEach(venue => venue.beers.forEach(beer => beers.push({venue: venue, beer: beer})));
        return (
            beers.sort((item1 , item2) => {
                return new Beer.Builder().withBeer(item2.beer).build().getOttawayScore()
                    - new Beer.Builder().withBeer(item1.beer).build().getOttawayScore()
            }).map(item => <BeerNearYouBrick beer={new Beer.Builder().withBeer(item.beer).build()} venue={item.venue}/>)
        );
    };

    useEffect(() => {
        setIsLoading(true);
        const api = new Beer4YourBuckAPI();
        getLocation((position) => {
            console.log("Accuracy: " + position.coords.accuracy.toFixed(2) + " m");
            setCurrPos(position);
            api.getVenuesNearYou(position.coords.latitude, position.coords.longitude, 1000)
                .then(data => {
                    setIsLoading(false);
                    const newVenues: BeerVenue[] = data.data;
                    console.log(JSON.stringify(newVenues));
                    if (newVenues.length > 0 && JSON.stringify(newVenues) !== JSON.stringify(venues)) {
                        setVenues(newVenues);
                    } else if (newVenues.filter((venue) => venue.beers.length > 0).length === 0) {
                        setNotifications([...notifications, {
                            title: "No Venues Near You",
                            message: "Looks like there's no venues near you that we know about." +
                                " Try expanding the search range or moving to another location." +
                                " Also, you can add a venue we don't know about by visiting the location" +
                                " and telling us what's there!",
                            timeout: 11000,
                            type: NotificationType.WARNING,
                        }])
                    }
                    setIsLoading(false);
                }).catch(err => {
                    setIsLoading(false);
                    setNotifications([...notifications, {
                        title: "Error Getting Locations Near You",
                        message: "There was an error getting locations near you. Please try again later.",
                        timeout: 5000,
                        type: NotificationType.ERROR
                    }]);
            });
        }, () => {
            console.log("Error getting position");
        });
    }, [setNotifications, venues]);

    return (
        <div className={'near-you-page-content'}>
            <Nav className={'near-you-nav'} tabs>
                <NavItem>
                    <NavLink className={'clickable'} active={mode === Mode.LOCATION} onClick={() => setMode(Mode.LOCATION)}>Location</NavLink>
                </NavItem>
                <NavItem >
                    <NavLink className={'clickable'} active={mode === Mode.BEER} onClick={() => setMode(Mode.BEER)}>Beer</NavLink>
                </NavItem>
            </Nav>
            {
                isLoading ? (
                    <LoadingSpinner message={"Finding places near you."}/>
                ) : (
                    <div className={'items-holder'}>
                        {
                            mode === Mode.LOCATION && getNearYouLocationBricks()
                        }
                        {
                            mode === Mode.BEER && getNearYouBeerBricks()
                        }
                    </div>
                )
            }
        </div>
    )
}