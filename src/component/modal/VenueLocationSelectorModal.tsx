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
import {getLocation} from "../../controller/LocationController";

const breweryApi = new Beer4YourBuckAPI();

interface Props {

}

export function VenueLocationSelectorModal(props: Props) {
    const [venueLocations, setVenueLocations] = useState<GooglePlace[] | null>(null);
    const [selectedVenue, setSelectedVenue] = useState<GooglePlace | null>(null);
    const [appearAutomatically, setAppearAutomatically] = useState<boolean>(true);
    const {venue, setVenue} = useContext(BeerVenueContext);


    const onSelected = (location: GooglePlace) => {
        setSelectedVenue(location)
    };

    const activateVenue = () => {
        if (selectedVenue && setVenue) {
            breweryApi.getVenueByGooglePlacesId(selectedVenue.placeId).then(data => {
                const foundVenue: BeerVenue | null = data.data;
                if (foundVenue) {
                    setVenue(foundVenue);
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
            getLocation((position => {
                breweryApi.searchPossibleVenueNearYou(position.coords.latitude, position.coords.longitude, 70)
                    .then(response => {
                        const rawResponse = response.data;
                        const locations: GooglePlace[] = response.data;
                        setVenueLocations(locations)
                    })
            }))
        }
    }, [props, appearAutomatically, venue]);

    if (venueLocations && venueLocations.length > 0) {
        return (
            <Modal isOpen={true}>
                <ModalHeader>
                    We noticed that you are near {venueLocations.length} location{venueLocations.length > 1 ? "s" : ''} that we know serves cold brews!
                </ModalHeader>
                <ModalBody>
                    <p>Would you like to set your location? Setting your location helps us fill in more info automatically!</p>
                    <VenueDropdown venues={venueLocations} onSelect={onSelected}/>
                </ModalBody>
                <ModalFooter>
                    <Button disabled={selectedVenue == null} color={'primary'} onClick={activateVenue}>Set Location!</Button>
                    <Button color={'secondary'} onClick={close}>Don't Set Location</Button>
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
                {text ? text : "Select Brewery"}
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