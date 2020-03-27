import React, {useContext, useState} from "react";
import {Collapse, Nav, Navbar, NavbarBrand, NavbarText, NavbarToggler, NavItem, NavLink} from "reactstrap";
import {BeerVenueContext} from "../../context/BeerVenueContext";
import {useHistory} from "react-router-dom";
import './top-nav-bar.css'

interface Props {

}

export function TopNavBar(props: Props) {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {venue} = useContext(BeerVenueContext);
    const history = useHistory();

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar color="light" light expand="sm">
                <NavbarBrand className={'clickable'} onClick={() => history.push('/')}>Beer 4 Your Buck</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <NavLink className={'clickable'} onClick={() => history.push('/near')}>Near You</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={'clickable'} onClick={() => history.push('/compare')}>Compare</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={'clickable'} onClick={() => history.push('/upload')}>Menu Upload</NavLink>
                        </NavItem>
                    </Nav>
                    <NavbarText>Current Venue: {venue && venue.name && venue.name !== '' ? venue.name : 'None'}</NavbarText>
                </Collapse>
            </Navbar>
        </div>
    );
}