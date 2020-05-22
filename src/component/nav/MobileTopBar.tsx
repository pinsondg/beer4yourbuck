import React, {useContext, useState} from "react";
import {useLocation} from "react-router";
// @ts-ignore
import Beer4YourBuckLogo from "../../image/domain/logos/LogoMakr_3Klh9R.png";
import {FaUser} from "react-icons/all";
import PopoverMenu, {PopoverDirection} from "../popover-menu/PopoverMenu";
import {UserContext} from "../../context/UserContext";
import {useHistory} from "react-router-dom";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";
import {Beer4YourBuckBtn, BtnType} from "../button/custom-btns/ThemedButtons";

const api = Beer4YourBuckAPI.getInstance();

export default function MobileTopBar() {
    const location = useLocation();
    const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);

    const determinePage = () => {
        switch (location.pathname) {
            case '/near':
                return 'Near You';
            case '/compare':
                return 'Quick Compare';
                break;
            case '/upload':
                return 'Menu Upload (Beta)';
            case '/current-venue':
                return 'Current Venue';
            case '/':
                return 'Home';
        }
    };

    return (
        <div style={{width: '100%'}}>
            <div style={{flex: '1 1 auto', color: '#f6c101', backgroundColor: '#343a40', padding: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <img style={{height: '45px', marginRight: '5px', borderRadius: '.25rem'}} src={Beer4YourBuckLogo}/>
                <h4>{determinePage()}</h4>
                <FaUser size={30} onClick={() => setProfileMenuOpen(!profileMenuOpen)}/>
            </div>
            <PopoverMenu
                onClose={() => setProfileMenuOpen(false)}
                isOpen={profileMenuOpen} titleText={'User Profile'}
                popoverDirection={PopoverDirection.RIGHT}
            >
                <ProfileMenuContent onCloseEvent={() => setProfileMenuOpen(false)}/>
            </PopoverMenu>
        </div>
    )
}

interface ProfileMenuContentProps {
    onCloseEvent: () => void;
}

function ProfileMenuContent(props: ProfileMenuContentProps) {
    const {user, setUser} = useContext(UserContext);
    const history = useHistory();

    const handleRegisterButtonClick = () => {
        props.onCloseEvent();
        history.push('/register');
    };

    const handleLoginButtonClick = () => {
        props.onCloseEvent();
        history.push('/login');
    };

    const handleLogoutClicked = () => {
        props.onCloseEvent();
        api.logout().then(() => {
            setUser(null);
            history.push('/');
        })
    };

    if (user) {
        return (
            <div style={{height: '100%', width: '100%', display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around'}}>
                <h5>{`Username: ${user.username}`}</h5>
                <Beer4YourBuckBtn customStyle={BtnType.PRIMARY} onClick={handleLogoutClicked}>Logout</Beer4YourBuckBtn>
            </div>
        )
    } else {
        return (
            <div style={{height: '100%', width: '100%', display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <h5>You are not logged in.</h5>
                <div style={{display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', margin: '10px'}}>
                    <Beer4YourBuckBtn id={'login-btn'} onClick={handleLoginButtonClick} customStyle={BtnType.PRIMARY_CLEAR}>Login</Beer4YourBuckBtn>
                    <p style={{margin: '5px'}}>or</p>
                    <Beer4YourBuckBtn id={'register-btn'} onClick={handleRegisterButtonClick} customStyle={BtnType.SECONDARY}>Sign Up</Beer4YourBuckBtn>
                </div>
            </div>
        )
    }
}