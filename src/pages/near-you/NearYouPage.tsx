import React, {ReactNode, useContext, useEffect, useReducer, useState} from "react";
import {LocationNearYouBrick} from "../../component/brick/LocationNearYouBrick";
import {BeerVenue} from "../../model/BeerVenue";
import {
    Col,
    Container,
    CustomInput,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
    UncontrolledDropdown
} from "reactstrap";
import './near-you-page.css'
import {Beer} from "../../model/Beer";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";
import {getDistance, getLocation, metersToMiles, milesToMeters} from "../../controller/LocationController";
import {LoadingSpinner} from "../../component/load/LoadSpinner";
import {BeerNearYouBrick} from "../../component/brick/BeerNearYouBrick";
import {NotificationContext, NotificationType} from "../../context/NotificationContext";
import 'rc-slider/assets/index.css';
import PopoverMenu, {PopoverDirection} from "../../component/menu/popover-menu/PopoverMenu";
import {Beer4YourBuckBtn, BtnType} from "../../component/button/custom-btns/ThemedButtons";
import DropdownSection from "../../component/misc/dropdown-section/DropdownSection";
import CustomCheckbox from "../../component/misc/checkbox/CustomCheckbox";
import {Filter, FilterType} from "../../model/Filter";
import ActiveFilterBadge from "../../component/badge/active-filter-badge/ActiveFilterBadge";


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

interface ActiveFilter {
    filterId: number;
    filter: Filter
}

type Action =
    | {type: 'add', filter: Filter}
    | {type: 'remove', filterId: number};

let filterIdCount = 0;

function filterReducer(state: ActiveFilter[], action: Action) {
    switch (action.type) {
        case "add":
            return [...state, {filterId: filterIdCount++, filter: action.filter}];
        case "remove":
            return state.filter(x => x.filterId !== action.filterId);
    }
}

const initialFilters: ActiveFilter[] =
    [{
        filterId: filterIdCount++,
        filter: {
            type: FilterType.DISTANCE,
            value: 5,
            displayValue: 'Distance: 5 miles'
        }
    }];

export function NearYouPage() {
    const [venues, setVenues] = useState<BeerVenue[]>([]);
    const [mode, setMode] = useState<Mode>(Mode.LOCATION);
    const [currPos, setCurrPos] = useState<Position>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {notifications, setNotifications} = useContext(NotificationContext);
    const [sideBarOpen, setSidebarOpen] = useState<boolean>(false);
    const [filters, filterDispatch] = useReducer(filterReducer, initialFilters);
    const [search, setSearch] = useState<string>('');
    const [range, setRange] = useState<number>(5);

    useEffect(() => {
        const newRange = filters.filter(x => x.filter.type === FilterType.DISTANCE)[0];
        if (newRange && range !== +newRange.filter.value) {
            setRange(+newRange.filter.value);
        }
    }, [filters, range]);

    const getFiltersOfType = (filterType: FilterType): Filter[] => {
        return filters.map(x => x.filter).filter(x => x.type === filterType);
    };

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
            .filter(venue => venue.name.toLowerCase().includes(search.toLowerCase()) || venue.beers.some(beer => beer.name && beer.name.toLowerCase().includes(search.toLowerCase())))
            .filter(venue => venue.venueTypes.some(venueType => getFiltersOfType(FilterType.VENUE_TYPE).length === 0 || getFiltersOfType(FilterType.VENUE_TYPE).map(x => x.value).includes(venueType.toLowerCase())))
            .filter(venue => {
                const priceFilter = getFiltersOfType(FilterType.MAX_PRICE)[0];
                if (!priceFilter) {
                    return true;
                } else {
                    return venue.beers.some(beer => beer.price && beer.price <= priceFilter.value)
                }
            })
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
            beers.filter(beer => (beer.beer.name && beer.beer.name.toLowerCase().includes(search.toLowerCase())) || beer.venue.name.toLowerCase().includes(search.toLowerCase()))
                .filter(beer => beer.venue.venueTypes.some(venueType => getFiltersOfType(FilterType.VENUE_TYPE).length === 0 || getFiltersOfType(FilterType.VENUE_TYPE).map(x => x.value).includes(venueType.toLowerCase())))
                .filter(beer => getFiltersOfType(FilterType.MAX_PRICE).length === 0 || getFiltersOfType(FilterType.MAX_PRICE).map(filter => +filter.value).some(price => beer.beer.price && beer.beer.price <= price))
                .sort((item1 , item2) => {
                return new Beer.Builder().withBeer(item2.beer).build().getOttawayScore()
                    - new Beer.Builder().withBeer(item1.beer).build().getOttawayScore()
            }).map(item => <BeerNearYouBrick key={key++} beer={new Beer.Builder().withBeer(item.beer).build()} venue={item.venue}/>)
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

    const removeFilter = (id: number): void => {
        filterDispatch({type: "remove", filterId: id});
    };

    return (
        <div className={'near-you-page-content'}>
            <NearYouSearchFilter
                isOpen={sideBarOpen}
                setIsOpen={setSidebarOpen}
                filterDispatch={filterDispatch}
                activeFilters={filters}
                venues={venues}
            />
            <Container fluid>
                <Row>
                    <Col>
                        <div style={{overflowX: "scroll", display: "flex", flexDirection: "row", alignItems: 'center', padding: '5px'}}>
                            {
                                filters.map(x =>
                                    <div style={{marginLeft: '2px', marginRight: '2px'}}>
                                        <ActiveFilterBadge
                                            filterId={x.filterId}
                                            filter={x.filter}
                                            onRemove={removeFilter}
                                            key={x.filterId}
                                            canRemove={x.filter.type !== FilterType.DISTANCE}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    </Col>
                </Row>
                <Row className={'align-items-center sticky-top'} style={{backgroundColor: 'white', padding: '5px', borderBottom: '1px solid lightgray'}}>
                    <Col xs={2}>
                        <Beer4YourBuckBtn id={'filterButton'} customStyle={BtnType.PRIMARY} onClick={() => {setSidebarOpen(!sideBarOpen)}}>Filter</Beer4YourBuckBtn>
                    </Col>
                    <Col xs={6}>
                        <Input style={{marginLeft: '5px'}} placeholder={'Search beer/venue'} onChange={(e) => {setSearch(e.target.value)}}/>
                    </Col>
                    <Col xs={4}>
                        <UncontrolledDropdown size={'sm'}>
                            <DropdownToggle color={'primary'} style={{ whiteSpace: 'normal'}} caret>
                                {mode === Mode.LOCATION ? "Closest" : "Best Beer"}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => setMode(Mode.LOCATION)}>Closest</DropdownItem>
                                <DropdownItem onClick={() => setMode(Mode.BEER)}>Best Beer</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Col>
                </Row>
                <Row>
                    <Col>
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
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

interface NearYouSearchFilterProps {
    isOpen: boolean;
    setIsOpen: (state: boolean) => void;
    activeFilters: ActiveFilter[];
    filterDispatch: (action: Action) => void;
    venues: BeerVenue[];
}

interface ActiveVenueTypes {
    bar: boolean,
    restaurant: boolean,
    brewery: boolean,
    store: boolean,
    other: boolean
}

interface PriceFilter {
    currValue: number | null;
    maxValue: number;
}

function NearYouSearchFilter(props: NearYouSearchFilterProps) {
    const [activeVenueTypes, setActiveVenueTypes] = useState<ActiveVenueTypes>({bar: false, brewery: false, other: false, store: false, restaurant: false});
    const [priceFilter, setPriceFilter] = useState<PriceFilter>({maxValue: 0, currValue: null});

    const getVenueTypeFilter = (type: string): ActiveFilter => {
        return props.activeFilters
            .filter(x => x.filter.type === FilterType.VENUE_TYPE)
            .filter(x => x.filter.value === type)[0]
    };

    const createVenueTypeFilter = (type: string): Filter => {
        return {
            type: FilterType.VENUE_TYPE,
            value: type,
            displayValue: `Venue Type: ${type.toUpperCase()}`
        }
    };

    const onVenueTypeFilterCheckboxClick = (box: string, selected: boolean) => {
        if (selected) {
            props.filterDispatch({type: "add", filter: createVenueTypeFilter(box)});
        } else {
            props.filterDispatch({type: "remove", filterId: getVenueTypeFilter(box).filterId});
        }
    };

    const getRangeValue = () => {
        return props.activeFilters.filter(x => x.filter.type === FilterType.DISTANCE)[0].filter.value;
    };

    const isVenueTypeActive = (type: string) => {
        return props.activeFilters
            .map(x => x.filter)
            .filter(x => x.type === FilterType.VENUE_TYPE)
            .filter(x => x.value === type)
            .length > 0;
    };

    const handleRangeChange = (val: number) => {
        const rangeFilter = props.activeFilters.filter(x => x.filter.type === FilterType.DISTANCE)[0];
        if (rangeFilter) {
            props.filterDispatch({type: "remove", filterId: rangeFilter.filterId})
        }
        props.filterDispatch({type: "add", filter: {type: FilterType.DISTANCE, value: val, displayValue: `Distance: ${val} miles`}});
    };

    const handlePriceChange = (val: number) => {
        setPriceFilter({...priceFilter, currValue: val});
        const currPriceFilter = props.activeFilters.filter(x => x.filter.type === FilterType.MAX_PRICE)[0];
        if (currPriceFilter) {
            props.filterDispatch({type: "remove", filterId: currPriceFilter.filterId});
        }
        props.filterDispatch({type: "add", filter: {type: FilterType.MAX_PRICE, value: val, displayValue: `Max Price: $${val.toFixed(2)}`}})
    };

    useEffect(() => {
        let maxPrice = 0;
        props.venues.forEach(venue => venue.beers.forEach(beer => {
            if (beer.price && beer.price > maxPrice) {
                maxPrice = beer.price;
            }
        }));
        const priceFilter = props.activeFilters.map(x => x.filter).filter(filter => filter.type === FilterType.MAX_PRICE);
        if (priceFilter && priceFilter[0]) {
            setPriceFilter({maxValue: maxPrice, currValue: +priceFilter[0].value})
        } else {
            setPriceFilter({maxValue: maxPrice, currValue: null})
        }
    }, [props]);

    useEffect(() => {
        setActiveVenueTypes({
            brewery: isVenueTypeActive('brewery'),
            bar: isVenueTypeActive('bar'),
            restaurant: isVenueTypeActive('restaurant'),
            other: isVenueTypeActive('other'),
            store: isVenueTypeActive('store')
        });
    }, [props.activeFilters]);

    return (
        <PopoverMenu isOpen={props.isOpen} popoverDirection={PopoverDirection.LEFT} titleText={'Search Settings'} onClose={() => props.setIsOpen(false)}>
            <div className={'filter-settings'}>
                <DropdownSection title={'Distance'}>
                    <div className={'setting range-holder'}>
                        <Form>
                            <FormGroup className={'align-items-center'} row>
                                <Label xs={2}>{getRangeValue()}<br/>miles</Label>
                                <Col xs={10}>
                                    <CustomInput id={'distance-input'} min={0.5} max={10} step={0.5} type={'range'} onChange={(e) => handleRangeChange(+e.target.value)} value={getRangeValue()}/>
                                </Col>
                            </FormGroup>
                        </Form>
                    </div>
                </DropdownSection>
                <DropdownSection title={'Max Price'}>
                    <div className={'setting range-holder'}>
                        <Form>
                            <FormGroup className={'align-items-center'} row>
                                <Label xs={2}>{priceFilter.currValue ? `$${priceFilter.currValue}` : 'Not Selected'}</Label>
                                <Col xs={10}>
                                    <CustomInput id={'price-input'} min={0} max={priceFilter.maxValue} step={0.5} type={'range'} onChange={(e) => handlePriceChange(+e.target.value)} value={priceFilter.currValue ? priceFilter.currValue : 0}/>
                                </Col>
                            </FormGroup>
                        </Form>
                    </div>
                </DropdownSection>
                <DropdownSection title={'Venue Type'}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div className={'checklist-row'}>
                            <h5>Bar</h5>
                            <CustomCheckbox selected={activeVenueTypes.bar} onChange={(val) => onVenueTypeFilterCheckboxClick('bar', val)} size={30}/>
                        </div>
                        <div className={'checklist-row'}>
                            <h5>Restaurant</h5>
                            <CustomCheckbox selected={activeVenueTypes.restaurant} onChange={(val) => onVenueTypeFilterCheckboxClick('restaurant', val)} size={30}/>
                        </div>
                        <div className={'checklist-row'}>
                            <h5>Brewery</h5>
                            <CustomCheckbox selected={activeVenueTypes.brewery} onChange={(val) => onVenueTypeFilterCheckboxClick('brewery', val)} size={30}/>
                        </div>
                        <div className={'checklist-row'}>
                            <h5>Store</h5>
                            <CustomCheckbox selected={activeVenueTypes.store} onChange={(val) => onVenueTypeFilterCheckboxClick('store', val)} size={30}/>
                        </div>
                        <div className={'checklist-row'}>
                            <h5>Other</h5>
                            <CustomCheckbox selected={activeVenueTypes.other} onChange={(val) => onVenueTypeFilterCheckboxClick('other', val)} size={30}/>
                        </div>
                    </div>
                </DropdownSection>
            </div>
        </PopoverMenu>
    )
}