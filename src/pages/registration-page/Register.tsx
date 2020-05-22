import React, {useContext, useEffect, useReducer, useState} from "react";
import {Col, Container, Form, FormGroup, Input, Label} from "reactstrap";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";
import {NotificationContext, NotificationType} from "../../context/NotificationContext";
import './register.css'
import classNames from "classnames";
import PasswordInput from "../../component/input/password-input/PasswordInput";
import {passwordRegex} from "../../controller/Utils";
import {Beer4YourBuckBtn, BtnType} from "../../component/button/custom-btns/ThemedButtons";

interface FieldData {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}

type Action =
    | {type: 'setEmail', val: string}
    | {type: 'setPassword', val: string}
    | {type: 'setUsername', val: string}
    | {type: 'setConfirmPassword', val: string}
    | {type: 'setLastName', val: string}
    | {type: 'setFirstName', val: string}

const initialState: FieldData = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
};

function reducer(state: FieldData, action: Action): FieldData {
    switch (action.type) {
        case "setConfirmPassword":
            return {...state, confirmPassword: action.val};
        case "setEmail":
            return {...state, email: action.val};
        case "setPassword":
            return {...state, password: action.val};
        case "setUsername":
            return {...state, username: action.val};
        case "setFirstName":
            return {...state, firstName: action.val};
        case "setLastName":
            return {...state, lastName: action.val};
    }
}

const api = Beer4YourBuckAPI.getInstance();

export default function Register() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {notifications, setNotifications} = useContext(NotificationContext);
    const [hideInput, setHideInput] = useState<boolean>(false);
    const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (e.target.id) {
            case 'username':
                dispatch({type: 'setUsername', val: e.target.value});
                break;
            case 'email':
                dispatch({type: 'setEmail', val: e.target.value});
                break;
            case 'last-name':
                dispatch({type: 'setLastName', val: e.target.value});
                break;
            case 'first-name':
                dispatch({type: 'setFirstName', val: e.target.value});
                break;
        }
    };

    const hideInputClasses = classNames({
        'name-field': hideInput
    });

    useEffect(() => {
        if (!hideInput) {
            setHideInput(true);
        }
    }, [hideInput]);

    const handleRegistrationError = (err: any) => {
        const type: string = err.response.data.type;
        switch (type) {
            case 'DUPLICATE_EMAIL':
                setNotifications([...notifications, {
                    title: 'Email Already Exists',
                    message: err.response.data.message,
                    type: NotificationType.ERROR,
                }]);
                break;
            case 'DUPLICATE_USERNAME':
                setNotifications([...notifications, {
                    title: 'Username Already Exists',
                    message: err.response.data.message,
                    type: NotificationType.ERROR,
                }]);
                break;
            case 'INVALID_PASSWORD':
                setNotifications([...notifications, {
                    title: "Password Does Not Meet Guidelines",
                    message: 'Your entered password does not meet our guidelines. Please review password guidelines and try again.',
                    type: NotificationType.ERROR,
                }]);
                break;
            case 'INVALID_EMAIL':
                setNotifications([...notifications, {
                    title: 'Invalid Email',
                    message: 'The email you entered is not a valid email address. Please try again.',
                    type: NotificationType.ERROR,
                }]);
                break;
            case 'EMAIL_SEND_ERROR':
                setNotifications([...notifications, {
                    title: 'Could Not Send Verification Email',
                    message: err.response.data.message,
                    type: NotificationType.ERROR
            }]);
                break;
            default:
                setNotifications([...notifications, {
                    title: 'Unknown Registration Error',
                    message: "Sorry we don't know what happened! Received an unknown error when creating your account." +
                        " Please try again later.",
                    type: NotificationType.ERROR
                }]);
                break;
        }
    };

    const handleRegister = () => {
        if (state.confirmPassword === state.password && passwordRegex.test(state.password) && state.email !== '' && state.username !== '') {
            api.register(state.username, state.email, state.password, state.firstName, state.lastName).then(data => {
                // setNotifications([...notifications, {
                //     title: 'Registration Successful',
                //     message: 'Thank you for registering!',
                //     timeout: 4000,
                //     type: NotificationType.SUCCESS
                // }]);
                // api.login(state.username, state.password, state.rememberMe).then(data => {
                //     api.getUserDetails().then(data => {
                //         setUser(data.data);
                //         history.push('/')
                //     })
                // })
                setRegisterSuccess(true);
            }).catch(err => {
                if (err.response && err.response.data) {
                    handleRegistrationError(err);
                } else {
                    console.log(err)
                }
            });
        } else if (state.confirmPassword !== state.password){
            setNotifications([...notifications, {
                title: 'Passwords Do Not Match',
                message: 'Your password and confirmed password do not match. Please try again',
                type: NotificationType.ERROR,
                timeout: 4000
            }]);
        } else if (!passwordRegex.test(state.password)) {
            setNotifications([...notifications, {
                title: "Password Does Not Meet Guidelines",
                message: 'Your entered password does not meet our guidelines. Please review password guidelines and try again.',
                type: NotificationType.ERROR,
                timeout: 4000
            }])
        } else if (state.username === '') {
            setNotifications([...notifications, {
                title: "Username is Empty",
                message: 'Username cannot be empty.',
                type: NotificationType.ERROR,
                timeout: 4000
            }]);
        } else if (state.email === '') {
            setNotifications([...notifications, {
                title: "Email is Empty",
                message: 'Email cannot be empty.',
                type: NotificationType.ERROR,
                timeout: 4000
            }]);
        }
    };

    return (
        <div style={{padding: '10px'}}>
            { !registerSuccess ? (
                <Container style={{margin: '0 auto'}}>
                    <h3>Sign Up</h3>
                    <Form style={{marginTop: '10px'}}>
                        <FormGroup row className={'name-field'}>
                            <Label>
                                First Name - DO NOT FILL
                            </Label>
                            <Col>
                                <Input id={'first-name'} tabindex="-1" name={'first-name'} autoComplete={'off'}
                                       onChange={onInputChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row className={hideInputClasses}>
                            <Label>
                                Last Name - DO NOT FILL
                            </Label>
                            <Col>
                                <Input id={'last-name'} tabindex="-1" name={'last-name'} onChange={onInputChange}
                                       autocomplete="off"/>
                            </Col>
                        </FormGroup>
                        <FormGroup row className={'justify-content-center align-items-center'}>
                            <Label xs={4} sm={2} for={'username'}>
                                Username
                            </Label>
                            <Col xs={8} sm={10}>
                                <Input name={'username'} id={'username'} placeholder={'Username'}
                                       onChange={onInputChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row className={'justify-content-center align-items-center'}>
                            <Label xs={4} sm={2} for={'email'}>
                                Email
                            </Label>
                            <Col xs={8} sm={10} className={'justify-content-center align-items-center'}>
                                <Input type={'email'} name={'email'} id={'email'} placeholder={'Email'}
                                       onChange={onInputChange}/>
                            </Col>
                        </FormGroup>
                        <PasswordInput
                            onPasswordChange={(val) => dispatch({type: 'setPassword', val: val})}
                            onConfirmPasswordChange={(val) => dispatch({type: 'setConfirmPassword', val: val})}
                        />
                        <FormGroup row>
                            <Col>
                                <Beer4YourBuckBtn customStyle={BtnType.SECONDARY} onClick={(e) => {e.preventDefault();handleRegister()}}>Register</Beer4YourBuckBtn>
                            </Col>
                        </FormGroup>
                    </Form>
                </Container>
            ) : (
                <div style={{overflow: "hidden"}}>
                    <h1>You're Almost Done!</h1>
                    <p>We've sent a verification email to {state.email}.
                        Please click on the link in the email to activate your account!
                        The email will be from notifications_donotreply@beer4yourbuck.com, if you do not see an email
                        from us within 10 minutes, check your spam folder.
                    </p>
                </div>
            )
            }
        </div>
    )
}