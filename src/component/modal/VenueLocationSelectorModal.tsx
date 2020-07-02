import React, {useContext, useEffect, useState} from "react";
import {BeerVenueContext} from "../../context/BeerVenueContext";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "reactstrap";
import {BeerVenue, GooglePlace} from "../../model/BeerVenue";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";
import {useCurrentGPSLocation} from "../../controller/LocationController";
import {NotificationContext, NotificationType} from "../../context/NotificationContext";

const breweryApi = Beer4YourBuckAPI.getInstance();

interface Props {
    onNoVenuesFound?: () => void;
}

export function VenueLocationSelectorModal(props: Props) {
    const currentGPSLocation = useCurrentGPSLocation();
    const [venueLocations, setVenueLocations] = useState<GooglePlace[] | null>(null);
    const [selectedVenue, setSelectedVenue] = useState<GooglePlace | null>(null);
    const [appearAutomatically, setAppearAutomatically] = useState<boolean>(true);
    const {venue, setVenue} = useContext(BeerVenueContext);
    const {notifications, setNotifications} = useContext(NotificationContext);


    const onSelected = (location: GooglePlace) => {
        setSelectedVenue(location)
    };

    const activateVenue = () => {
        if (selectedVenue && setVenue) {
            breweryApi.getVenueByGooglePlacesId(selectedVenue.placeId).then(data => {
                const foundVenue: BeerVenue | null = data.data;
                if (foundVenue) {
                    setVenue(foundVenue);
                    setNotifications([...notifications, {
                        title: 'Help Us Out!',
                        message: `Thanks for setting your venue to ${foundVenue.name}. Take a second to upvote/downvote beers
                        to help us provide accurate data.`,
                        type: NotificationType.INFO
                    }]);
                } else {
                    breweryApi.createNewVenue(selectedVenue, []).then(data => setVenue(data.data))
                }
            });
        }
        close();
    };

    const close = () => {
        setSelectedVenue(null);
        setVenueLocations(null);
        setAppearAutomatically(false);
    };

    useEffect(() => {
        if (appearAutomatically && !venue) {
            if (currentGPSLocation.currentPosition !== null && !currentGPSLocation.hasError && !venueLocations) {
                breweryApi.searchPossibleVenueNearYou(currentGPSLocation.currentPosition.latitude, currentGPSLocation.currentPosition.longitude, 50)
                    .then(response => {
                        const locations: GooglePlace[] = response.data;
                        setVenueLocations(locations);
                        if (locations.length === 0 && props.onNoVenuesFound) {
                            props.onNoVenuesFound();
                        }
                    })
                    .catch(err => {
                        if (props.onNoVenuesFound) {
                            props.onNoVenuesFound();
                        }
                    });
            } else if (currentGPSLocation.hasError){
                setNotifications([...notifications, {
                    title: 'Error Getting Your Location',
                    message: 'There was an error getting your current location. Please make sure you have given ' +
                        'your browser and this website permission to access your location.',
                    timeout: 6000,
                    type: NotificationType.ERROR
                }]);
            }
        }
    }, [props, appearAutomatically, venue, currentGPSLocation, notifications, setNotifications]);

    if (venueLocations && venueLocations.length > 0) {
        return (
            <Modal isOpen={true}>
                <ModalHeader>
                    We noticed that you are near {venueLocations.length} venue{venueLocations.length > 1 ? "s" : ''} that we know serves cold brews!
                </ModalHeader>
                <ModalBody>
                    <p>Would you like to set your venue? Setting your venue allows you to publish beers to it, which helps other users find the best beers near them!</p>
                    <VenueDropdown venues={venueLocations} onSelect={onSelected}/>
                </ModalBody>
                <ModalFooter>
                    <Button disabled={selectedVenue == null} color={'primary'} onClick={activateVenue}>Set Location!</Button>
                    <Button color={'secondary'} onClick={() => {
                        close();
                        if (props.onNoVenuesFound) {
                            props.onNoVenuesFound()
                        }}}>Don't Set Location</Button>
                </ModalFooter>
            </Modal>
        )
    } else {
        return null;
    }
}

interface DropdownItems {
    venues: GooglePlace[] | null;
    onSelect: (venueLocation: GooglePlace) => void;
}

let dropdownItemKey = 0;

const VenueDropdown = (props: DropdownItems) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [text, setText] = useState<string | null>(null);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    const onItemClick = (index: number) => {
        if (props.venues) {
            setText(props.venues[index].name);
            props.onSelect(props.venues[index])
        }
    };

    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret>
                {text ? text : "Select Venue"}
            </DropdownToggle>
            <DropdownMenu>
                {props.venues && props.venues.map((venue, index) => (
                    <IndexedDropdownItem index={index} key={dropdownItemKey++} onClick={onItemClick} element={<div>{venue.name}</div>}/>
                ))}
            </DropdownMenu>
        </Dropdown>
    )
};

interface IndexedDropdownItemProps {
    index: number
    onClick: (index: number) => void;
    element: JSX.Element;
}

function IndexedDropdownItem(props: IndexedDropdownItemProps) {

    const onClick = () => {
        props.onClick(props.index);
    };

    return (
        <DropdownItem onClick={onClick}>{props.element}</DropdownItem>
    )
}