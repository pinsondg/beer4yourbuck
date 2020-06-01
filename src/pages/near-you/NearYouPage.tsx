import React, {ReactNode, useContext, useEffect, useState} from "react";
import {LocationNearYouBrick} from "../../component/brick/LocationNearYouBrick";
import {BeerVenue} from "../../model/BeerVenue";
import {
    Col,
    CustomInput,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    FormGroup,
    Input,
    Label,
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
import 'rc-slider/assets/index.css';
import {IoMdOptions} from "react-icons/io";
import PopoverMenu, {PopoverDirection} from "../../component/popover-menu/PopoverMenu";
import {Beer4YourBuckBtn, BtnType} from "../../component/button/custom-btns/ThemedButtons";
import DropdownSection from "../../component/misc/dropdown-section/DropdownSection";
import CustomCheckbox from "../../component/misc/checkbox/CustomCheckbox";


enum Mode {
    LOCATION, BEER
}

interface VenueTypeFilter {
    brewery: boolean;
    restaurant: boolean;
    bar: boolean;
    store: boolean;
    other: boolean;
}

let key = 0;

const mockVenue: BeerVenue = {
    id: "1",
    beers: [new Beer.Builder().withVolume(5.0).withAbv("6.0").withId("2").withName("Bud Light").withPrice(4.0).build()],
    lat: 37.87604,
    lon: -77.98573,
    name: "Sticky Rice",
    venueTypes: ["BREWERY"],
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
    const [venueTypeFilter, setVenueTypeFilter] = useState<string[]>([]);

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
            .filter(venue => venue.name.toLowerCase().includes(nameFilter.toLowerCase()) || venue.beers.some(beer => beer.name && beer.name.toLowerCase().includes(nameFilter.toLowerCase())))
            .filter(venue => venue.venueTypes.some(venueType => venueTypeFilter.includes(venueType.toLowerCase())))
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
            beers.filter(beer => (beer.beer.name && beer.beer.name.toLowerCase().includes(nameFilter.toLowerCase())) || beer.venue.name.toLowerCase().includes(nameFilter.toLowerCase()))
                .filter(beer => beer.venue.venueTypes.some(venueType => venueTypeFilter.includes(venueType.toLowerCase())))
                .sort((item1 , item2) => {
                return new Beer.Builder().withBeer(item2.beer).build().getOttawayScore()
                    - new Beer.Builder().withBeer(item1.beer).build().getOttawayScore()
            }).map(item => <BeerNearYouBrick key={key++} beer={new Beer.Builder().withBeer(item.beer).build()} venue={item.venue}/>)
        );
    };

    const onVenueFilterChange = (filter: VenueTypeFilter) => {
        console.log("Filter: " + JSON.stringify(filter));
        const newFilter = [];
        if (filter.store)  {
            newFilter.push('store');
        }
        if (filter.brewery) {
            newFilter.push('brewery');
        }
        if (filter.other)  {
            newFilter.push('other');
        }
        if (filter.bar) {
            newFilter.push('bar');
        }
        if (filter.restaurant) {
            newFilter.push('restaurant');
        }
        if (newFilter.length === 0) {
            newFilter.push('restaurant', 'bar', 'other', 'brewery', 'store');
        }
        setVenueTypeFilter(newFilter);
        console.log('Venue types: ', newFilter);
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
                    if (JSON.stringify(newVenues) !== JSON.stringify(venues)) {
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
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: '5px'}}>
                <Beer4YourBuckBtn id={'filterButton'} customStyle={BtnType.PRIMARY} onClick={() => {setSidebarOpen(!sideBarOpen)}}><IoMdOptions size={15}/></Beer4YourBuckBtn>
                <Input style={{marginLeft: '5px'}} placeholder={'Filter by beer/venue name'} onChange={(e) => {setNameFilter(e.target.value)}}/>
                <UncontrolledTooltip target={'filterButton'}>Edit Search Settings</UncontrolledTooltip>
            </div>
            <NearYouSearchFilter
                mode={mode}
                onRangeChange={(range) => setRange(range)}
                onModeChange={(mode) => setMode(mode)}
                isOpen={sideBarOpen}
                setIsOpen={setSidebarOpen}
                onVenueTypeFilterChange={onVenueFilterChange}
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
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onVenueTypeFilterChange: (typeFilter: VenueTypeFilter) => void;
}

function NearYouSearchFilter(props: NearYouSearchFilterProps) {
    const [range, setRange] = useState<number>(0.5);
    const [mode, setMode] = useState<Mode>(Mode.LOCATION);
    const [venueTypeFilter, setVenueTypeFilter] = useState<VenueTypeFilter>({
        brewery: false,
        restaurant: false,
        bar: false,
        other: false,
        store: false
    });

    const onVenueTypeFilterCheckboxClick = (box: string) => {
        switch (box) {
            case 'restaurant':
                setVenueTypeFilter({...venueTypeFilter, restaurant: !venueTypeFilter.restaurant});
                break;
            case 'bar':
                setVenueTypeFilter({...venueTypeFilter, bar: !venueTypeFilter.bar});
                break;
            case 'other':
                setVenueTypeFilter({...venueTypeFilter, other: !venueTypeFilter.other});
                break;
            case 'brewery':
                setVenueTypeFilter({...venueTypeFilter, brewery: !venueTypeFilter.brewery});
                break;
            case 'store':
                setVenueTypeFilter({...venueTypeFilter, store: !venueTypeFilter.store});
                break;
        }
    };

    const handleRangeChange = (val: number) => {
        props.onRangeChange(val);
        setRange(val);
    };

    useEffect(() => {
        props.onVenueTypeFilterChange(venueTypeFilter);
    }, [venueTypeFilter]);

    useEffect(() => {
        setMode(props.mode);
    }, [props]);

    const getTickMarks = (): ReactNode => {
        const options: ReactNode[] = [];
        for (let i = 0.5; i < 10; i = i += 0.5) {
            options.push(<option value={i} label={i % 5 === 0 || i === 0.5 ? i.toString() : ''}/>)
        }
        return <datalist id={'tickmarks'}>
            {
                options
            }
        </datalist>
    };

    return (
        <PopoverMenu isOpen={props.isOpen} popoverDirection={PopoverDirection.LEFT} titleText={'Search Settings'} onClose={() => props.setIsOpen(false)}>
            <div className={'filter-settings'}>
                <DropdownSection title={'Result Type'}>
                    <UncontrolledDropdown style={{marginLeft: '10px'}}>
                        <DropdownToggle caret>
                            {mode === Mode.LOCATION ? "Location" : "Beer"}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={() => {props.onModeChange(Mode.LOCATION)}}>Location</DropdownItem>
                            <DropdownItem onClick={() => props.onModeChange(Mode.BEER)}>Beer</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </DropdownSection>
                <DropdownSection title={'Range'}>
                    <div className={'setting range-holder'}>
                        <Form>
                            <FormGroup className={'align-items-center'} row>
                                <Label xs={2}>{range}<br/>miles</Label>
                                <Col xs={10}>
                                    <CustomInput min={0.5} max={10} step={0.5} type={'range'} onChange={(e) => handleRangeChange(+e.target.value)} value={range}/>
                                </Col>
                            </FormGroup>
                        </Form>
                    </div>
                </DropdownSection>
                <DropdownSection title={'Venue Type'}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div className={'checklist-row'}>
                            <h5>Bar</h5>
                            <CustomCheckbox onChange={(val) => onVenueTypeFilterCheckboxClick('bar')} size={30}/>
                        </div>
                        <div className={'checklist-row'}>
                            <h5>Restaurant</h5>
                            <CustomCheckbox onChange={(val) => onVenueTypeFilterCheckboxClick('restaurant')} size={30}/>
                        </div>
                        <div className={'checklist-row'}>
                            <h5>Brewery</h5>
                            <CustomCheckbox onChange={(val) => onVenueTypeFilterCheckboxClick('brewery')} size={30}/>
                        </div>
                        <div className={'checklist-row'}>
                            <h5>Store</h5>
                            <CustomCheckbox onChange={(val) => onVenueTypeFilterCheckboxClick('store')} size={30}/>
                        </div>
                        <div className={'checklist-row'}>
                            <h5>Other</h5>
                            <CustomCheckbox onChange={(val) => onVenueTypeFilterCheckboxClick('other')} size={30}/>
                        </div>
                    </div>
                </DropdownSection>
            </div>
        </PopoverMenu>
    )
}