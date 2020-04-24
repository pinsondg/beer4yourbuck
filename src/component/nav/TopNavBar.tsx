import React, {useContext, useEffect, useState} from "react";
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from "reactstrap";
import {BeerVenueContext} from "../../context/BeerVenueContext";
import {useHistory, useLocation} from "react-router-dom";
import './top-nav-bar.css'
import {isMobile} from "../../controller/Utils";
import {UserContext} from "../../context/UserContext";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";
import {NotificationContext, NotificationType} from "../../context/NotificationContext";

interface Props {

}

const api = new Beer4YourBuckAPI();

export function TopNavBar(props: Props) {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<string | null>(null);
    const {venue} = useContext(BeerVenueContext);
    const {user, setUser} = useContext(UserContext);
    const {notifications, setNotifications} = useContext(NotificationContext);
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
            case '/current-venue':
                setSelected('venue');
                break;
            default:
                setSelected(null);
                break;
        }
    }, [location.pathname]);

    const logout = () => {
        api.logout().then(() => {
            setUser(null);
            setNotifications([...notifications, {
                title: 'Log Out Successful',
                message: 'You have logged out successfully.',
                timeout: 4000,
                type: NotificationType.SUCCESS
            }]);
            history.push('/');
        })
    };

    return (
        <Navbar color={'dark'} expand="sm" dark style={{marginBottom: '0 !important'}}>
            <NavbarBrand className={'brand clickable'} onClick={() => history.push('/')}>Beer 4 Your Buck</NavbarBrand>
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
                    {venue && <NavItem className={!isMobile() && selected && selected === 'venue' ? 'selected-nav' : ''}>
                        <NavLink className={'clickable'} onClick={() => history.push('/current-venue')}>Current Venue</NavLink>
                    </NavItem>}
                </Nav>
                <Nav className="ml-auto" navbar>
                    {
                        user === null ? (
                                <div style={{display: "flex", flexDirection:"row"}}>
                                    <NavItem>
                                        <NavLink className={'clickable'} onClick={() => history.push('/login')}>Login</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={'clickable'} onClick={() => history.push('/register')}>Sign Up</NavLink>
                                    </NavItem>
                                </div>
                        ) : (
                            <NavItem style={{margin: '5px'}}>
                                <NavLink className={'clickable'} onClick={logout}>Logout</NavLink>
                            </NavItem>
                        )
                    }
                </Nav>
            </Collapse>
        </Navbar>
    );
}