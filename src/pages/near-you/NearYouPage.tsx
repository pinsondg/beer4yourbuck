import React, {ReactNode, useContext, useEffect, useState} from "react";
import {LocationNearYouBrick} from "../../component/brick/LocationNearYouBrick";
import {BeerVenue} from "../../model/BeerVenue";
import {
    Button,
    Collapse,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Input,
    UncontrolledDropdown,
    UncontrolledTooltip
} from "reactstrap";
import './near-you-page.css'
import {Beer} from "../../model/Beer";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";
import {getDistance, getLocation, metersToMiles, milesToMeters} from "../../controller/LocationController";
import {LoadingSpinner} from "../../component/load/LoadSpinner";
import {BeerNearYouBrick} from "../../component/brick/BeerNearYouBrick";
import {NotificationContext, NotificationType} from "../../context/NotificationContext";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {IoMdOptions} from "react-icons/io";
import {MdClose} from 'react-icons/md';


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
    const [sideBarOpen, setSidebarOpen] = useState<boolean>(false);
    const [range, setRange] = useState<number>(0.5);
    const [nameFilter, setNameFilter] = useState<string>('');

    useEffect(() => {
        const filtered = venues.filter(venue => {
            if (currPos) {
                const distance = metersToMiles(getDistance(currPos.coords.latitude, currPos.coords.longitude, venue.lat, venue.lon));
                return distance <= range;
            }
            return false;
        });
        if (JSON.stringify(filtered) !== JSON.stringify(venues)) {
            setVenues(filtered);
        }
    }, [venues, range, currPos]);

    const getNearYouLocationBricks = (): ReactNode => {
        return [...venues].sort((venue1, venue2)=> {
            let distance1 = 0;
            let distance2 = 0;
            if (currPos) {
                distance1 = metersToMiles(getDistance(venue1.lat, venue1.lon, currPos.coords.latitude, currPos.coords.longitude));
                distance2 = metersToMiles(getDistance(venue2.lat, venue2.lon, currPos.coords.latitude, currPos.coords.longitude));
            }
            return distance1 - distance2;
        }).filter(venue => venue.beers.length > 0)
            .filter(venue => venue.name.includes(nameFilter) || venue.beers.some(beer => beer.name && beer.name.includes(nameFilter)))
            .map(venue => {
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
            beers.filter(beer => (beer.beer.name && beer.beer.name.includes(nameFilter)) || beer.venue.name.includes(nameFilter)).sort((item1 , item2) => {
                return new Beer.Builder().withBeer(item2.beer).build().getOttawayScore()
                    - new Beer.Builder().withBeer(item1.beer).build().getOttawayScore()
            }).map(item => <BeerNearYouBrick beer={new Beer.Builder().withBeer(item.beer).build()} venue={item.venue}/>)
        );
    };

    useEffect(() => {
        setIsLoading(true);
        const api = Beer4YourBuckAPI.getInstance();
        getLocation((position) => {
            console.log("Accuracy: " + position.coords.accuracy.toFixed(2) + " m");
            setCurrPos(position);
            api.getVenuesNearYou(position.coords.latitude, position.coords.longitude, milesToMeters(range))
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
            setIsLoading(false);
            setNotifications([...notifications, {
                title: 'Error Getting Your Location',
                message: 'There was an error getting your current location. Plase make sure you have given ' +
                    'your browser and this website permission to access your location.',
                timeout: 6000,
                type: NotificationType.ERROR
            }])
        });
    }, [setNotifications, venues, range]);

    const onSetOpen = (open: boolean) => {
        setSidebarOpen(open);
    };

    return (
        <div className={'near-you-page-content'}>
            <Button id={'filterButton'} className={'filter-button'} onClick={() => {setSidebarOpen(!sideBarOpen)}}>{sideBarOpen ? (<MdClose size={15}/>) : (<IoMdOptions size={15}/>)}</Button>
            <UncontrolledTooltip target={'filterButton'}>Edit Search Settings</UncontrolledTooltip>
            <NearYouSearchFilter
                mode={mode}
                onRangeChange={(range) => setRange(range)}
                onModeChange={(mode) => setMode(mode)}
                isOpen={sideBarOpen}
                onSearchChange={(nameFilter) => setNameFilter(nameFilter)}
            />
            {
                isLoading ? (
                    <LoadingSpinner className={'spinner'} message={"Finding places near you."}/>
                ) : venues.filter(venue => venue.beers.length > 0).length === 0 ? (
                    <div style={{margin: 'auto'}}>We couldn't find any venues near you! Try expanding the search range.</div>
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

interface NearYouSearchFilterProps {
    mode: Mode;
    onRangeChange: (range: number) => void;
    onModeChange: (mode: Mode) => void;
    onSearchChange: (search: string) => void;
    isOpen: boolean;
}

function NearYouSearchFilter(props: NearYouSearchFilterProps) {
    const [range, setRange] = useState<number>(0.5);
    const [mode, setMode] = useState<Mode>(Mode.LOCATION);

    useEffect(() => {
        setMode(props.mode);
    }, [props]);

    return (
        <Collapse className={'filter-settings-holder'} isOpen={props.isOpen}>
            <p>Search Settings</p>
            <div className={'filter-settings'}>
                <div className={'setting'}>
                    Search
                    <Input placeholder={'Filter by beer/venue name'} onChange={(e) => {props.onSearchChange(e.target.value)}}/>
                </div>
                <div className={'setting'}>
                    Sort By
                    <UncontrolledDropdown>
                        <DropdownToggle caret>
                            {mode === Mode.LOCATION ? "Location" : "Beer"}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={() => {props.onModeChange(Mode.LOCATION)}}>Location</DropdownItem>
                            <DropdownItem onClick={() => props.onModeChange(Mode.BEER)}>Beer</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
                <div className={'setting range-holder'}>
                    Search Range
                    <Slider className={'range-slider'} defaultValue={0.5} min={0.5} max={50} step={0.5} onAfterChange={() => props.onRangeChange(range)} onChange={(i) => setRange(i)}/>
                    {range}<br/>miles
                </div>
            </div>
        </Collapse>
    )
}