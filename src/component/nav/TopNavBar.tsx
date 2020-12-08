import React, {useContext, useEffect, useState} from "react";
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from "reactstrap";
import {useHistory, useLocation} from "react-router-dom";
import './top-nav-bar.css'
import {isMobile} from "../../controller/Utils";
import {LoginStatus, UserContext} from "../../context/UserContext";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";
import {NotificationContext, NotificationType} from "../../context/NotificationContext";
import Beer4YourBuckLogo from '../../image/domain/logos/LogoMakr_3Klh9R.png'

interface Props {

}

const api = Beer4YourBuckAPI.getInstance();

export function TopNavBar(props: Props) {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<string | null>(null);
    const {user, setUser, setLoginStatus} = useContext(UserContext);
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

    const logOutFrontend = () => {
        setUser(null);
        setLoginStatus(LoginStatus.LOGGED_OUT);
        setNotifications([...notifications, {
            title: 'Logout Successful',
            message: 'You have logged out successfully.',
            timeout: 4000,
            type: NotificationType.SUCCESS
        }]);
        history.push('/');
    };

    const logout = () => {
        api.logout().then(() => {
            logOutFrontend();
        }).catch(err => {
            if (err.response && err.response.status === 401) {
                //user is probably not logged in if 401 from logout so log them out of frontend
                logOutFrontend();
            } else {
                setNotifications([...notifications, {
                    title: 'Logout Failed',
                    message: 'Logout failed. Please try again later or refresh the page.',
                    timeout: 4000,
                    type: NotificationType.ERROR
                }]);
            }
        });
    };

    return (
        <Navbar color={'dark'} expand="sm" dark style={{marginBottom: '0 !important'}}>
            <NavbarBrand className={'brand clickable'} onClick={() => history.push('/')}><div style={{height: '100%'}}><img alt={'Logo'} style={{height: '45px', marginRight: '5px', borderRadius: '.25rem'}} src={Beer4YourBuckLogo}/>Beer 4 Your Buck</div></NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
                <Nav className="mr-auto" navbar>
                    <NavItem className={!isMobile() && selected && selected === 'near' ? 'selected-nav' : ''}>
                        <NavLink className={'clickable'} onClick={() => history.push('/near')}>Near You</NavLink>
                    </NavItem>
                    <NavItem className={!isMobile() && selected && selected === 'compare' ? 'selected-nav' : ''}>
                        <NavLink className={'clickable'} onClick={() => history.push('/compare')}>Quick Compare</NavLink>
                    </NavItem>
                    <NavItem className={!isMobile() && selected && selected === 'upload' ? 'selected-nav' : ''}>
                        <NavLink className={'clickable'} onClick={() => history.push('/upload')}>Menu Upload</NavLink>
                    </NavItem>
                    <NavItem className={!isMobile() && selected && selected === 'venue' ? 'selected-nav' : ''}>
                        <NavLink className={'clickable'} onClick={() => history.push('/current-venue')}>Current Venue</NavLink>
                    </NavItem>
                </Nav>
                <Nav className="ml-auto" navbar>
                    {user === null && <NavItem>
                        <NavLink className={'clickable'} onClick={() => history.push('/login')}>Login</NavLink>
                    </NavItem>}
                    {user === null && <NavItem>
                            <NavLink className={'clickable'} onClick={() => history.push('/register')}>Sign Up</NavLink>
                        </NavItem>}
                    {user !== null && <NavItem style={{margin: '5px'}}>
                        <NavLink className={'clickable'} onClick={logout}>Logout</NavLink>
                    </NavItem>}
                </Nav>
            </Collapse>
        </Navbar>
    );
}