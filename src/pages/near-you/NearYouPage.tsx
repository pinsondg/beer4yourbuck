import React, {ReactNode, ReactText, useContext, useEffect, useRef, useState} from "react";
import {LocationNearYouBrick} from "../../component/brick/localtion-near-you-brick/LocationNearYouBrick";
import {BeerVenue} from "../../model/BeerVenue";
import {
    Button,
    Col,
    Container,
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
import {getDistance, metersToMiles, milesToMeters, useCurrentGPSLocation} from "../../controller/LocationController";
import {LoadingSpinner} from "../../component/load/LoadSpinner";
import {BeerNearYouBrick} from "../../component/brick/beer-near-you-brick/BeerNearYouBrick";
import {NotificationContext, NotificationType} from "../../context/NotificationContext";
import 'rc-slider/assets/index.css';
import PopoverMenu, {PopoverDirection} from "../../component/menu/popover-menu/PopoverMenu";
import DropdownSection from "../../component/dropdown/dropdown-section/DropdownSection";
import {Filter, FilterType} from "../../model/Filter";
import ActiveFilterBadge from "../../component/badge/active-filter-badge/ActiveFilterBadge";
import {NearYouFilterContext} from "../../context/NearYouFilterContext";
import {NearYouVenuesContext} from "../../context/NearYouVenuesContext";
import {usePrevious} from "../../CustomHooks";
import {capitalizeFirstLetter, GenericMapWrapper} from "../../controller/Utils";
import ChecklistRow from "../../component/input/checklist-row/ChecklistRow";
import SelectDropdownSection, {SelectionItem} from "../../component/dropdown/select-dropdown-section/SelectDropdownSection";
import {CurrentContentRef} from "../../context/CurrentContentRef";


enum Mode {
    LOCATION, BEER
}

let key = 0;

export function NearYouPage() {
    const {contentRef, setContentRef} = useContext(CurrentContentRef);
    const  nearYouContentRef = useRef(null);
    const {filterDispatch, filters} = useContext(NearYouFilterContext);
    const getFiltersOfType = (filterType: FilterType): Filter[] => {
        return filters.map(x => x.filter).filter(x => x.type === filterType);
    };
    const {nearYouVenues, nearYouVenueDispatch} = useContext(NearYouVenuesContext);
    const gpsLocation = useCurrentGPSLocation();
    const [mode, setMode] = useState<Mode>(Mode.BEER);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFetchingBeers, setIsFetchingBeers] = useState<boolean>(false);
    const {notifications, setNotifications} = useContext(NotificationContext);
    const [sideBarOpen, setSidebarOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [range, setRange] = useState<number>(getFiltersOfType(FilterType.DISTANCE)[0] ? +getFiltersOfType(FilterType.DISTANCE)[0].value : 5);
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
        if (nearYouVenues.state !== null) {
            const results =  [...nearYouVenues.state].sort((venue1, venue2)=> {
                let distance1 = 0;
                let distance2 = 0;
                if (gpsLocation.currentPosition && !gpsLocation.hasError) {
                    distance1 = metersToMiles(getDistance(venue1.lat, venue1.lon, gpsLocation.currentPosition.latitude, gpsLocation.currentPosition.longitude));
                    distance2 = metersToMiles(getDistance(venue2.lat, venue2.lon, gpsLocation.currentPosition.latitude, gpsLocation.currentPosition.longitude));
                }
                return distance1 - distance2;
            })
                .filter(venue => venue.name.toLowerCase().includes(search.toLowerCase()) || venue.beers.some(beer => beer.name && beer.name.toLowerCase().includes(search.toLowerCase())))
                .filter(venue => venue.venueTypes.some(venueType => getFiltersOfType(FilterType.VENUE_TYPE).length === 0 || getFiltersOfType(FilterType.VENUE_TYPE).map(x => x.value.toString().toLowerCase()).includes(venueType.toLowerCase())))
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
                    if (gpsLocation.currentPosition && !gpsLocation.hasError) {
                        distance = metersToMiles(getDistance(venue.lat, venue.lon, gpsLocation.currentPosition.latitude, gpsLocation.currentPosition.longitude));
                    }
                    return (
                        <LocationNearYouBrick key={key++} distance={distance} venue={venue}/>
                    )
                });
            setResults(results);
        }
    };

    const getNearYouBeerBricks = () => {
        let beers: {beer: Beer, venue: BeerVenue}[] = [];
        if (!nearYouVenues) return [];
        if (nearYouVenues.state !== null) {
            nearYouVenues.state.forEach(venue => venue.beers.forEach(beer => beers.push({venue: venue, beer: beer})));
            const results =  (
                beers.filter(beer => (beer.beer.name && beer.beer.name.toLowerCase().includes(search.toLowerCase())) || beer.venue.name.toLowerCase().includes(search.toLowerCase()))
                    .filter(beer => beer.venue.venueTypes.some(venueType => getFiltersOfType(FilterType.VENUE_TYPE).length === 0 || getFiltersOfType(FilterType.VENUE_TYPE).map(x => x.value.toString().toLowerCase()).includes(venueType.toLowerCase())))
                    .filter(beer => getFiltersOfType(FilterType.MAX_PRICE).length === 0 || getFiltersOfType(FilterType.MAX_PRICE).map(filter => +filter.value).some(price => beer.beer.price && beer.beer.price <= price))
                    .filter(beer => getFiltersOfType(FilterType.BEER_TYPE).length === 0 || getFiltersOfType(FilterType.BEER_TYPE).map(filter => filter.value).some(type => beer.beer.beerType && beer.beer.beerType === type))
                    .filter(beer => getFiltersOfType(FilterType.COUNT).length === 0 || getFiltersOfType(FilterType.COUNT).map(filter => filter.value).some(type => beer.beer.count && beer.beer.count === +type))
                    .sort((item1 , item2) => {
                        return new Beer.Builder().withBeer(item2.beer).build().getOttawayScore()
                            - new Beer.Builder().withBeer(item1.beer).build().getOttawayScore()
                    }).map(item => <BeerNearYouBrick key={key++} beer={new Beer.Builder().withBeer(item.beer).build()} venue={item.venue}/>)
            );
            setResults(results);
        }
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
        setContentRef(nearYouContentRef);
    });

    /**
     * Reload the venues.
     */
    useEffect(() => {
        console.log(`Is loading: ${isLoading}; GPS has error: ${gpsLocation.hasError}; GPS coordinates: ${gpsLocation.currentPosition ? gpsLocation.currentPosition.longitude.toFixed(4) : 'N/A'}, ${gpsLocation.currentPosition ? gpsLocation.currentPosition.latitude.toFixed(4) : 'N/A'}; Has near you venues: ${!!nearYouVenues.state}`);
        if (isLoading && (gpsLocation.hasError)) {
            setIsLoading(false);
            setNotifications([...notifications, {
                title: 'Error Getting Your Location',
                message: 'There was an error getting your current location. Please make sure you have given ' +
                    'your browser and this website permission to access your location.',
                timeout: 6000,
                type: NotificationType.ERROR
            }]);
        } else if (isLoading && !isFetchingBeers && !nearYouVenues.state && !nearYouVenues.error && gpsLocation.currentPosition) {
            console.log("Refreshing beers...");
            nearYouVenueDispatch({type: "refresh", coords: gpsLocation.currentPosition, radius: milesToMeters(range)});
            setIsFetchingBeers(true);
        } else if (isLoading && nearYouVenues.error) {
            setIsLoading(false);
            setIsFetchingBeers(false);
            setNotifications([...notifications, {
                title: "Error Getting Locations Near You",
                message: "There was an error getting locations near you. Please try again later.",
                timeout: 5000,
                type: NotificationType.ERROR
            }]);
        } else if (isLoading && nearYouVenues.state) {
            setIsLoading(false);
            setIsFetchingBeers(false);
        }
    }, [
        isLoading,
        gpsLocation.hasError,
        gpsLocation.currentPosition,
        nearYouVenues.state,
        nearYouVenues.error,
        setNotifications,
        notifications,
        nearYouVenueDispatch,
        range,
        isFetchingBeers
    ]);

    /*
     * Clear errors when we leave the page.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( () => () => nearYouVenueDispatch({type: "clearError"}), [] );

    //clear venues every range change
    useEffect(() => {
        if (prevRange && range && range !== prevRange) {
            nearYouVenueDispatch({type: 'clear'});
        }
    }, [prevRange, range, nearYouVenueDispatch]);

    // set loading to true every time the venues get cleared without an error
    useEffect(() => {
        if (!nearYouVenues.state && !nearYouVenues.error) {
            setIsLoading(true);
        }
    }, [setIsLoading, nearYouVenues.state, nearYouVenues.error]);

    const removeFilter = (id: number): void => {
        filterDispatch({type: "remove", filterId: id});
    };

    return (
        <div ref={contentRef} className={'near-you-page-content'}>
            <NearYouSearchFilter
                isOpen={sideBarOpen}
                setIsOpen={setSidebarOpen}
                venues={nearYouVenues.state ? nearYouVenues.state : []}
            />
            <Container fluid>
                <Row>
                    <Col>
                        <div style={{overflowX: "scroll", display: "flex", flexDirection: "row", alignItems: 'center', padding: '5px'}}>
                            {
                                filters.map(x =>
                                    <div key={x.filterId} style={{marginLeft: '2px', marginRight: '2px'}}>
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
                                <LoadingSpinner className={'spinner'} message={`Finding ${String.fromCodePoint(0x1F37A)} near you...`}/>
                            ) : !nearYouVenues.state || nearYouVenues.state.filter(venue => venue.beers.length > 0).length === 0 ? (
                                <div style={{margin: 'auto', padding: '5px'}}>
                                    We couldn't find any beers near you. This is due to no users in your area reporting beers they find.
                                    Help improve the results in your area by visiting any location that serves beer, navigating to the <a href='/current-venue'>current
                                    venue page</a>, and adding beers that you find!
                                </div>
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


function NearYouSearchFilter(props: NearYouSearchFilterProps) {
    const [priceFilter, setPriceFilter] = useState<string>('');
    const {filters, filterDispatch} = useContext(NearYouFilterContext);
    const [currentOpen, setCurrentOpen]  = useState<string | null>(null);

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
            setPriceFilter(`$${priceFilter.value.toFixed(2)}`);
        } else {
            setPriceFilter('None');
        }
    }, [filters]);

    const onFilterCheckboxClick = (value: ReactText, checked: boolean, filterType: FilterType) => {
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

    const isFilterActive = (val: ReactText, filterType: FilterType): boolean => {
        return filters.filter(filter => filter.filter.type === filterType)
            .some(filter => filter.filter.value === val)
    };

    const handleAllSelected = (key: string, vals: SelectionItem[], selected: boolean, filterType: FilterType) => {
        vals.forEach(val => {
            onFilterCheckboxClick(`${key} - ${val.value}`, selected, filterType);
        });
    };

    const createBeerSubsections = (nodes: React.ReactNode[], vals: Set<string | number>) => {
        const map: GenericMapWrapper<Set<string>> = new GenericMapWrapper<Set<string>>();
        vals.forEach(x => {
            if (typeof x === 'string') {
                const split = x.split(' - ');
                const type = split[0];
                const subType = split[1];
                if (split.length > 1) {
                    let subTypes = map.get(type);
                    if (!subTypes) {
                        subTypes = new Set<string>();
                        map.put(type, subTypes);
                    }
                    subTypes.add(subType);
                } else {
                    map.put(type, new Set<string>());
                }
            }
        });
        map.forEach((key, val) => {
            if (val.size === 0) {
                nodes.push(
                    <ChecklistRow
                        key={key}
                        title={key}
                        selected={isFilterActive(key, FilterType.BEER_TYPE)}
                        onChange={(checked) => onFilterCheckboxClick(key, checked, FilterType.BEER_TYPE)}
                    />
                )
            } else {
                let items: SelectionItem[] = [];
                val.forEach(x => {
                    const selectionItem: SelectionItem = {
                        value: x,
                        selected: isFilterActive(`${key} - ${x}`, FilterType.BEER_TYPE)
                    };
                    items.push(selectionItem);
                });
                nodes.push(
                    <SelectDropdownSection
                        key={key}
                        title={key}
                        items={items}
                        onAllSelected={(selected) => handleAllSelected(key, items, selected, FilterType.BEER_TYPE)}
                        onOneSelected={(val, checked) => onFilterCheckboxClick(val, checked, FilterType.BEER_TYPE)}
                    />
                )
            }
        });
    };

    const getCheckboxNodesForFilter = (filter: FilterType): ReactNode => {
        const vals: Set<string | number> = new Set<string | number>();
        props.venues.forEach(venue => venue.beers.forEach(beer => {
            switch (filter) {
                case FilterType.BEER_TYPE:
                    if (beer.beerType) vals.add(beer.beerType);
                    break;
                case FilterType.COUNT:
                    if (beer.count) vals.add(beer.count);
                    break;
                case FilterType.VENUE_TYPE:
                    venue.venueTypes.forEach(type => vals.add(capitalizeFirstLetter(type)));
                    break;
            }
        }));
        const nodes: ReactNode[] = [];
        if (filter === FilterType.BEER_TYPE) {
            createBeerSubsections(nodes, vals);
        } else {
            Array.from(vals).sort((x1, x2) => {
                if (typeof x1 === 'number' && typeof x2 === 'number') {
                    return +x1 - +x2;
                } else {
                    return 0;
                }
            }).forEach(val => {
                nodes.push(
                    <ChecklistRow
                        key={val}
                        title={val}
                        selected={isFilterActive(val, filter)}
                        onChange={(checked) => onFilterCheckboxClick(val, checked, filter)}
                    />
                )
            });
        }
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
        let key = 0;
        nodes.push(<option key={key++}>None</option>);
        for (let i = Math.floor(min); i <= max; i = i + 0.5) {
            nodes.push(<option key={key++}>{`$${i.toFixed(2)}`}</option>)
        }
        return nodes;
    };

    const handleOtherOpen = (isOpen: boolean, title: string) => {
        if (isOpen) {
            setCurrentOpen(title);
        }
    };

    const isDropdownOpen = (title: string): boolean => {
        return currentOpen === title;
    };

    const getRangeOptions = (): ReactNode[] => {
        const retList: ReactNode[] = [];
        for (let i = 0.5; i <= 10; i += 0.5) {
            retList.push(<option key={i}>{i}</option>);
        }
        return retList;
    };

    return (
        <PopoverMenu isOpen={props.isOpen} popoverDirection={PopoverDirection.LEFT} titleText={'Search Settings'} onClose={() => props.setIsOpen(false)}>
            <div className={'filter-settings'}>
                <DropdownSection isOpen={isDropdownOpen('Distance')} onChange={isOpen => handleOtherOpen(isOpen, 'Distance')} title={'Distance'}>
                    <div className={'setting range-holder'}>
                        <Form>
                            <FormGroup className={'align-items-center'} row>
                                <Label xs={4}>Distance (miles)</Label>
                                <Col xs={8}>
                                    <Input value={getRangeValue()} type={'select'} onChange={(e) => handleRangeChange(+e.target.value)}>
                                        {getRangeOptions()}
                                    </Input>
                                </Col>
                            </FormGroup>
                        </Form>
                    </div>
                </DropdownSection>
                <DropdownSection isOpen={isDropdownOpen('Max Price')} onChange={isOpen => handleOtherOpen(isOpen, 'Max Price')} title={'Max Price'}>
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
                <DropdownSection isOpen={isDropdownOpen('Venue Type')} onChange={isOpen => handleOtherOpen(isOpen, 'Venue Type')} title={'Venue Type'}>
                    {getCheckboxNodesForFilter(FilterType.VENUE_TYPE)}
                </DropdownSection>
                <DropdownSection isOpen={isDropdownOpen('Beer Type')} onChange={isOpen => handleOtherOpen(isOpen, 'Beer Type')} title={'Beer Type'}>
                    {getCheckboxNodesForFilter(FilterType.BEER_TYPE)}
                </DropdownSection>
                <DropdownSection isOpen={isDropdownOpen('Count')} onChange={isOpen => handleOtherOpen(isOpen, 'Count')} title={'Count'}>
                    {getCheckboxNodesForFilter(FilterType.COUNT)}
                </DropdownSection>
            </div>
            <Button onClick={() => filterDispatch({type: 'clear'})}>Clear All Filters</Button>
        </PopoverMenu>
    )
}