import React, {useContext, useReducer} from "react";
import {Button, Col, Container, Form, FormGroup, Input, Label, Row, UncontrolledCollapse} from "reactstrap";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";
import {NotificationContext, NotificationType} from "../../context/NotificationContext";
import {useHistory} from "react-router-dom";
import {UserContext} from "../../context/UserContext";

interface FieldData {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    rememberMe: boolean;
}

var passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");


type Action =
    | {type: 'setEmail', val: string}
    | {type: 'setPassword', val: string}
    | {type: 'setUsername', val: string}
    | {type: 'setConfirmPassword', val: string}
    | {type: 'setRememberMe', val: boolean}

const initialState: FieldData = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
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
        case "setRememberMe":
            return {...state, rememberMe: action.val}
    }
}

const api = new Beer4YourBuckAPI();

export default function Register() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {notifications, setNotifications} = useContext(NotificationContext);
    const {user, setUser} = useContext(UserContext);
    const history = useHistory();

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (e.target.id) {
            case 'username':
                dispatch({type: 'setUsername', val: e.target.value});
                break;
            case 'password':
                dispatch({type: 'setPassword', val: e.target.value});
                break;
            case 'email':
                dispatch({type: 'setEmail', val: e.target.value});
                break;
            case 'confirm-password':
                dispatch({type: 'setConfirmPassword', val: e.target.value});
                break;
            case 'remember-me':
                dispatch({type: "setRememberMe", val: !state.rememberMe})
        }
    };

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
        }
    };

    const handleRegister = () => {
        if (state.confirmPassword === state.password && passwordRegex.test(state.password) && state.email !== '' && state.username !== '') {
            api.register(state.username, state.email, state.password).then(data => {
                setNotifications([...notifications, {
                    title: 'Registration Successful',
                    message: 'Thank you for registering!',
                    timeout: 4000,
                    type: NotificationType.SUCCESS
                }]);
                api.login(state.username, state.password, state.rememberMe).then(data => {
                    api.getUserDetails().then(data => {
                        setUser(data.data);
                        history.push('/')
                    })
                })
            }).catch(err => {
                handleRegistrationError(err);
                console.log(JSON.stringify(err.response));
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
            <Container style={{margin: '0 auto'}}>
                <h3>Sign Up</h3>
                <Form style={{marginTop: '10px'}}>
                    <FormGroup row className={'justify-content-center align-items-center'}>
                        <Label xs={4} sm={2} for={'username'}>
                            Username
                        </Label>
                        <Col xs={8} sm={10}>
                            <Input name={'username'} id={'username'} placeholder={'Username'} onChange={onInputChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row className={'justify-content-center align-items-center'}>
                        <Label xs={4} sm={2} for={'email'}>
                            Email
                        </Label>
                        <Col xs={8} sm={10} className={'justify-content-center align-items-center'}>
                            <Input type={'email'} name={'email'} id={'email'} placeholder={'Email'} onChange={onInputChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row className={'justify-content-center align-items-center'}>
                        <Label xs={4} sm={2} for={'password'}>
                            Password
                        </Label>
                        <Col xs={8} sm={10}>
                            <Input type={'password'} name={'password'} id={'password'} placeholder={'Password'} onChange={onInputChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row className={'justify-content-center align-items-center'}>
                        <Label xs={4} sm={2} for={'confirm-password'}>
                            Confirm Password
                        </Label>
                        <Col xs={8} sm={10}>
                            <Input type={'password'} name={'confirm-password'} id={'confirm-password'} placeholder={'Confirm Password'} onChange={onInputChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup check className={'align-items-center justify-content-center'}>
                        <Label check><Input id={'remember-me'} onChange={onInputChange} type={'checkbox'}/> Remember Me</Label>
                    </FormGroup>
                    <Row>
                        <Col>
                            <Button id={'toggler'} color={'link'}>View Password Guidelines</Button>
                            <UncontrolledCollapse toggler={'#toggler'}>
                                <p>Must contain at least 1 lowercase alphabetical character</p>
                                <p>Must contain at least 1 uppercase alphabetical character</p>
                                <p>Must contain at least 1 numeric character</p>
                                <p>Must contain at least one special character (!@#$%^&*)</p>
                                <p>Must be eight characters or longer</p>
                            </UncontrolledCollapse>
                        </Col>
                    </Row>
                    <FormGroup row>
                        <Col>
                            <Button color={'primary'} onClick={handleRegister}>Register</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    )
}