import React, {ReactNode, useContext, useEffect, useState} from "react";
import {LocationNearYouBrick} from "../../component/brick/LocationNearYouBrick";
import {BeerVenue} from "../../model/BeerVenue";
import {
    Button,
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
import './near-you-page.scss'
import {Beer} from "../../model/Beer";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";
import {getDistance, getLocation, metersToMiles, milesToMeters} from "../../controller/LocationController";
import {LoadingSpinner} from "../../component/load/LoadSpinner";
import {BeerNearYouBrick} from "../../component/brick/BeerNearYouBrick";
import {NotificationContext, NotificationType} from "../../context/NotificationContext";
import 'rc-slider/assets/index.css';
import PopoverMenu, {PopoverDirection} from "../../component/menu/popover-menu/PopoverMenu";
import DropdownSection from "../../component/misc/dropdown-section/DropdownSection";
import CustomCheckbox from "../../component/misc/checkbox/CustomCheckbox";
import {Filter, FilterType} from "../../model/Filter";
import ActiveFilterBadge from "../../component/badge/active-filter-badge/ActiveFilterBadge";
import {NearYouFilterContext} from "../../context/NearYouFilterContext";
import {NearYouVenuesContext} from "../../context/NearYouVenuesContext";
import {usePrevious} from "../../CustomHooks";
import {capitalizeFirstLetter} from "../../controller/Utils";


enum Mode {
    LOCATION, BEER
}

let key = 0;

export function NearYouPage() {
    const {filterDispatch, filters} = useContext(NearYouFilterContext);
    const getFiltersOfType = (filterType: FilterType): Filter[] => {
        return filters.map(x => x.filter).filter(x => x.type === filterType);
    };
    const {nearYouVenues, setNearYouVenues} = useContext(NearYouVenuesContext);
    const [mode, setMode] = useState<Mode>(Mode.BEER);
    const [currPos, setCurrPos] = useState<Position>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {notifications, setNotifications} = useContext(NotificationContext);
    const [sideBarOpen, setSidebarOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [range, setRange] = useState<number>(+getFiltersOfType(FilterType.DISTANCE)[0].value);
    const [results, setResults] = useState<ReactNode[] | null>(null);
    const prevRange = usePrevious<number>(range);

    useEffect(() => {
        const newRange = filters.filter(x => x.filter.type === FilterType.DISTANCE)[0];
        if (newRange && range !== +newRange.filter.value) {
            setRange(+newRange.filter.value);
        }
    }, [filters, range]);

    const getNearYouLocationBricks = () => {
        if (!nearYouVenues) return [];
        const results =  [...nearYouVenues].sort((venue1, venue2)=> {
            let distance1 = 0;
            let distance2 = 0;
            if (currPos) {
                distance1 = metersToMiles(getDistance(venue1.lat, venue1.lon, currPos.coords.latitude, currPos.coords.longitude));
                distance2 = metersToMiles(getDistance(venue2.lat, venue2.lon, currPos.coords.latitude, currPos.coords.longitude));
            }
            return distance1 - distance2;
        })
            .filter(venue => venue.name.toLowerCase().includes(search.toLowerCase()) || venue.beers.some(beer => beer.name && beer.name.toLowerCase().includes(search.toLowerCase())))
            .filter(venue => venue.venueTypes.some(venueType => getFiltersOfType(FilterType.VENUE_TYPE).length === 0 || getFiltersOfType(FilterType.VENUE_TYPE).map(x => x.value).includes(venueType.toLowerCase())))
            .filter(venue => venue.beers.some(beer => beer.beerType && (getFiltersOfType(FilterType.BEER_TYPE).length === 0 || getFiltersOfType(FilterType.BEER_TYPE).map(x => x.value.toString().toLowerCase()).includes(beer.beerType.toLowerCase()))))
            .filter(venue => {
                const priceFilter = getFiltersOfType(FilterType.MAX_PRICE)[0];
                if (!priceFilter) {
                    return true;
                } else {
                    return venue.beers.some(beer => beer.price && beer.price <= priceFilter.value)
                }
            })
            .filter(venue => venue.beers.length > 0)
            .map(venue => {
            let distance = 0;
            if (currPos) {
                distance = metersToMiles(getDistance(venue.lat, venue.lon, currPos.coords.latitude, currPos.coords.longitude));
            }
            return (
                <LocationNearYouBrick key={key++} distance={distance} venue={venue}/>
            )
        });
        setResults(results);
    };

    const getNearYouBeerBricks = () => {
        let beers: {beer: Beer, venue: BeerVenue}[] = [];
        if (!nearYouVenues) return [];
        nearYouVenues.forEach(venue => venue.beers.forEach(beer => beers.push({venue: venue, beer: beer})));
        const results =  (
            beers.filter(beer => (beer.beer.name && beer.beer.name.toLowerCase().includes(search.toLowerCase())) || beer.venue.name.toLowerCase().includes(search.toLowerCase()))
                .filter(beer => beer.venue.venueTypes.some(venueType => getFiltersOfType(FilterType.VENUE_TYPE).length === 0 || getFiltersOfType(FilterType.VENUE_TYPE).map(x => x.value).includes(venueType.toLowerCase())))
                .filter(beer => getFiltersOfType(FilterType.MAX_PRICE).length === 0 || getFiltersOfType(FilterType.MAX_PRICE).map(filter => +filter.value).some(price => beer.beer.price && beer.beer.price <= price))
                .filter(beer => getFiltersOfType(FilterType.BEER_TYPE).length === 0 || getFiltersOfType(FilterType.BEER_TYPE).map(filter => filter.value).some(type => beer.beer.beerType && beer.beer.beerType === type))
                .filter(beer => getFiltersOfType(FilterType.COUNT).length === 0 || getFiltersOfType(FilterType.COUNT).map(filter => filter.value).some(type => beer.beer.count && beer.beer.count === +type))
                .sort((item1 , item2) => {
                return new Beer.Builder().withBeer(item2.beer).build().getOttawayScore()
                    - new Beer.Builder().withBeer(item1.beer).build().getOttawayScore()
            }).map(item => <BeerNearYouBrick key={key++} beer={new Beer.Builder().withBeer(item.beer).build()} venue={item.venue}/>)
        );
        setResults(results);
    };

    useEffect(() => {
        if (mode === Mode.LOCATION) {
            getNearYouLocationBricks();
        } else {
            getNearYouBeerBricks();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, nearYouVenues, filters, search]);

    useEffect(() => {
        setIsLoading(true);
        const api = Beer4YourBuckAPI.getInstance();
        getLocation((position) => {
            console.log("Accuracy: " + position.coords.accuracy.toFixed(2) + " m");
            setCurrPos(position);
            if ((!nearYouVenues && !prevRange) || (prevRange && prevRange !== range)) {
                api.getVenuesNearYou(position.coords.latitude, position.coords.longitude, milesToMeters(range))
                    .then(data => {
                        setIsLoading(false);
                        const newVenues: BeerVenue[] = data.data;
                        if (JSON.stringify(nearYouVenues) !== JSON.stringify(newVenues)) {
                            setNearYouVenues(newVenues);
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
            } else {
                setIsLoading(false);
            }
        }, () => {
            setIsLoading(false);
            setNotifications([...notifications, {
                title: 'Error Getting Your Location',
                message: 'There was an error getting your current location. Please make sure you have given ' +
                    'your browser and this website permission to access your location.',
                timeout: 6000,
                type: NotificationType.ERROR
            }])
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setNotifications, range, nearYouVenues, setNearYouVenues]);

    const removeFilter = (id: number): void => {
        filterDispatch({type: "remove", filterId: id});
    };

    return (
        <div className={'near-you-page-content'}>
            <NearYouSearchFilter
                isOpen={sideBarOpen}
                setIsOpen={setSidebarOpen}
                venues={nearYouVenues ? nearYouVenues : []}
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
                <Row className={'align-items-center sticky-top'} style={{backgroundColor: 'white', padding: '5px'}}>
                    <Col>
                        <Input type={'search'} style={{marginLeft: '5px'}} placeholder={'Search beer/venue'} onChange={(e) => {setSearch(e.target.value)}}/>
                    </Col>
                </Row>
                <Row className={'align-items-center'} style={{backgroundColor: 'white', padding: '5px', borderBottom: '1px solid lightgray'}}>
                    <Col xs={4} style={{borderRight: 'solid lightgray 1px'}}>
                        <Button size={'sm'} id={'filterButton'} color={'link'} onClick={() => {setSidebarOpen(!sideBarOpen)}}>Filters{` (${filters.length})`}</Button>
                    </Col>
                    <Col xs={4}>
                        <p>{`${results ? results.length : '0'} results`}</p>
                    </Col>
                    <Col xs={4} style={{borderLeft: 'solid lightgray 1px'}}>
                        <UncontrolledDropdown size={'sm'}>
                            <DropdownToggle color={'link'} style={{ whiteSpace: 'normal'}} caret>
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
                    <Col style={{paddingLeft: '0', paddingRight: '0'}}>
                        {
                            isLoading ? (
                                <LoadingSpinner className={'spinner'} message={"Finding places near you."}/>
                            ) : !nearYouVenues || nearYouVenues.filter(venue => venue.beers.length > 0).length === 0 ? (
                                <div style={{margin: 'auto'}}>We couldn't find any venues near you! Try expanding the search range.</div>
                            ) : (
                                <div className={'items-holder'}>
                                    {results}
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
    venues: BeerVenue[];
}

interface ActiveVenueTypes {
    bar: boolean,
    restaurant: boolean,
    brewery: boolean,
    store: boolean,
    other: boolean
}

function NearYouSearchFilter(props: NearYouSearchFilterProps) {
    const [priceFilter, setPriceFilter] = useState<string>('');
    const {filters, filterDispatch} = useContext(NearYouFilterContext);

    const getRangeValue = () => {
        return filters.filter(x => x.filter.type === FilterType.DISTANCE)[0].filter.value;
    };

    const handleRangeChange = (val: number) => {
        const rangeFilter = filters.filter(x => x.filter.type === FilterType.DISTANCE)[0];
        if (rangeFilter) {
            filterDispatch({type: "remove", filterId: rangeFilter.filterId})
        }
        filterDispatch({type: "add", filter: {type: FilterType.DISTANCE, value: val, displayValue: `Distance: ${val} miles`}});
    };

    const handlePriceChange = (val: string | null) => {
        console.log(val);
        const convertedVal: number = val !== null && val.includes('$') ? +val.substring(val.indexOf('$') + 1).trim() : -1;
        const currPriceFilter = filters.filter(x => x.filter.type === FilterType.MAX_PRICE)[0];
        if (currPriceFilter) {
            filterDispatch({type: "remove", filterId: currPriceFilter.filterId});
        }
        if (convertedVal !== -1) {
            filterDispatch({type: "add", filter: {type: FilterType.MAX_PRICE, value: convertedVal, displayValue: `Max Price: $${convertedVal.toFixed(2)}`}});
        }
    };

    useEffect(() => {
        const priceFilter = filters.filter(filter => filter.filter.type === FilterType.MAX_PRICE).map(x => x.filter)[0];
        if (priceFilter && typeof priceFilter.value === 'number') {
            console.log(`Set price filter to: $${priceFilter.value.toFixed(2)}`);
            setPriceFilter(`$${priceFilter.value.toFixed(2)}`);
        } else {
            setPriceFilter('None');
        }
    }, [filters]);

    const onFilterCheckboxClick = (value: string, checked: boolean, filterType: FilterType) => {
        const beerTypeFilters = filters.filter(x => x.filter.type === filterType);
        if (!checked) {
            const filterId = beerTypeFilters.filter(x => x.filter.value === value)[0].filterId;
            filterDispatch({type: "remove", filterId: filterId});
        } else {
            filterDispatch({type: "add", filter: {
                    type: filterType,
                    value: value,
                    displayValue: `${filterType}: ${value}`
                }});
        }
    };

    const isFilterActive = (val: string, filterType: FilterType): boolean => {
        return filters.filter(filter => filter.filter.type === filterType)
            .some(filter => filter.filter.value === val)
    };

    const getCheckboxNodesForFilter = (filter: FilterType): ReactNode => {
        const vals: Set<string> = new Set<string>();
        props.venues.forEach(venue => venue.beers.forEach(beer => {
            switch (filter) {
                case FilterType.BEER_TYPE:
                    if (beer.beerType) vals.add(beer.beerType);
                    break;
                case FilterType.COUNT:
                    if (beer.count) vals.add(beer.count.toFixed(0));
                    break;
                case FilterType.VENUE_TYPE:
                    venue.venueTypes.forEach(type => vals.add(capitalizeFirstLetter(type)));
                    break;
            }
        }));
        const nodes: ReactNode[] = [];
        vals.forEach(val => {
            nodes.push(<div className={'checklist-row'}>
                <div className={'title-holder'}>
                    <h5>{val}</h5>
                </div>
                <div className={'checkbox-holder'}>
                    <CustomCheckbox selected={isFilterActive(val, filter)} onChange={(checked) => onFilterCheckboxClick(val, checked, filter)} size={30}/>
                </div>
            </div>)
        });
        return nodes;
    };

    const getMaxPriceOptions = (): ReactNode => {
        let max: number = 0;
        let min: number = Number.MAX_VALUE;
        props.venues.forEach(venue => venue.beers.forEach(beer => {
            if (beer.price && beer.price > max) {
                max = beer.price;
            }
            if (beer.price && (beer.price < min)) {
                min = beer.price;
            }
        }));
        const nodes: ReactNode[] = [];
        nodes.push(<option>None</option>);
        for (let i = Math.floor(min); i <= max; i = i + 0.5) {
            nodes.push(<option>{`$${i.toFixed(2)}`}</option>)
        }
        return nodes;
    };

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
                    <div>
                        <Form>
                            <FormGroup>
                                <Input value={priceFilter} type={'select'} onChange={(e) => handlePriceChange(e.target.value)}>
                                    {getMaxPriceOptions()}
                                </Input>
                            </FormGroup>
                        </Form>
                    </div>
                </DropdownSection>
                <DropdownSection title={'Venue Type'}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        {getCheckboxNodesForFilter(FilterType.VENUE_TYPE)}
                    </div>
                </DropdownSection>
                <DropdownSection title={'Beer Type'}>
                    <div style={{display: 'flex', flexDirection: "column"}}>
                        {getCheckboxNodesForFilter(FilterType.BEER_TYPE)}
                    </div>
                </DropdownSection>
                <DropdownSection title={'Count'}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        {getCheckboxNodesForFilter(FilterType.COUNT)}
                    </div>
                </DropdownSection>
            </div>
        </PopoverMenu>
    )
}