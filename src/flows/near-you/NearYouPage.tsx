import React, {ReactNode, useEffect, useState} from "react";
import {LocationNearYouBrick} from "../../component/brick/LocationNearYouBrick";
import {BeerVenue} from "../../model/BeerVenue";
import {Nav, NavItem, NavLink} from "reactstrap";
import './near-you-page.css'
import {Beer} from "../../model/Beer";
import BreweryDBAPI from "../../controller/api/BreweryDBAPI";
import {getDistance, getLocation, metersToMiles} from "../../controller/LocationController";
import {LoadingSpinner} from "../../component/load/LoadSpinner";

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

    useEffect(() => {
        setIsLoading(true);
        const api = new BreweryDBAPI();
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
                    }
                }).catch(err => {
                    setIsLoading(false);
            });
        }, () => {
            console.log("Error getting position");
        });
    }, [venues]);

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
                    </div>
                )
            }
        </div>
    )
}