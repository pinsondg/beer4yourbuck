import React, {useContext, useEffect, useState} from "react";
import {Collapse, Nav, Navbar, NavbarBrand, NavbarText, NavbarToggler, NavItem, NavLink} from "reactstrap";
import {BeerVenueContext} from "../../context/BeerVenueContext";
import {useHistory, useLocation} from "react-router-dom";
import './top-nav-bar.css'
import {isMobile} from "../../controller/Utils";

interface Props {

}

export function TopNavBar(props: Props) {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<string | null>(null);
    const {venue} = useContext(BeerVenueContext);
    const history = useHistory();

    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        switch (location.pathname) {
            case '/near':
                setSelected('near');
                break;
            case '/compare':
                setSelected('compare');
                break;
            case '/upload':
                setSelected('upload');
                break;
            default:
                setSelected(null);
                break;
        }
    }, [location.pathname]);

    return (
        <Navbar color="light" light expand="sm">
            <NavbarBrand className={'clickable'} onClick={() => history.push('/')}>Beer 4 Your Buck</NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
                <Nav className="mr-auto" navbar>
                    <NavItem className={!isMobile() && selected && selected === 'near' ? 'selected-nav' : ''}>
                        <NavLink className={'clickable'} onClick={() => history.push('/near')}>Near You</NavLink>
                    </NavItem>
                    <NavItem className={!isMobile() && selected && selected === 'compare' ? 'selected-nav' : ''}>
                        <NavLink className={'clickable'} onClick={() => history.push('/compare')}>Compare</NavLink>
                    </NavItem>
                    <NavItem className={!isMobile() && selected && selected === 'upload' ? 'selected-nav' : ''}>
                        <NavLink className={'clickable'} onClick={() => history.push('/upload')}>Menu Upload</NavLink>
                    </NavItem>
                </Nav>
                <NavbarText>Current Venue: {venue && venue.name && venue.name !== '' ? venue.name : 'None'}</NavbarText>
            </Collapse>
        </Navbar>
    );
}