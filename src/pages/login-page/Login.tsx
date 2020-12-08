import React, {useContext, useState} from "react";
import {Button, Col, Collapse, Container, Form, FormGroup, Input, Label} from "reactstrap";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";
import {useHistory} from "react-router-dom";
import {NotificationContext, NotificationType} from "../../context/NotificationContext";
import {LoginStatus, UserContext} from "../../context/UserContext";
import './login.css'
import {Beer4YourBuckBtn, BtnType} from "../../component/button/custom-btns/ThemedButtons";
import {LoadingSpinner} from "../../component/load/LoadSpinner";
import PasswordShowHide from "../../component/input/PasswordShowHide/PasswordShowHide";

interface Props {

}

const api = Beer4YourBuckAPI.getInstance();

export default function Login(props: Props) {
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const history = useHistory();
    const {notifications, setNotifications} = useContext(NotificationContext);
    const {setUser, setLoginStatus} = useContext(UserContext);
    const [forgotPassword, setForgotPassword] = useState<boolean>(false);
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        var val = e.target.value;
        setName(val);
    };

    const onPasswordChange = (val: string) => {
        setPassword(val);
    };

    const onSubmit = () => {
        if (name === '') {
            setNotifications([...notifications, {
                title: 'Username/Email is Blank',
                message: 'Please fill in the Username/email.',
                type: NotificationType.ERROR
            }]);
        } else {
            if (!forgotPassword && !isLoggingIn) {
                setIsLoggingIn(true);
                setLoginStatus(LoginStatus.LOGGING_IN);
                api.login(name, password, rememberMe).then(data => {
                    api.getUserDetails().then(data => {
                        setIsLoggingIn(false);
                        setNotifications([...notifications, {
                            title: 'Log In Successful',
                            message: `You have successfully logged in as user ${data.data.username}`,
                            type: NotificationType.SUCCESS,
                            timeout: 5000
                        }]);
                        setUser(data.data);
                        setLoginStatus(LoginStatus.LOGGED_IN);
                        history.push('/');
                    });
                }).catch(err => {
                    setIsLoggingIn(false);
                    setLoginStatus(LoginStatus.LOGIN_FAILURE);
                    if (err.response.data && err.response.data.exception === 'User is disabled') {
                        setNotifications([...notifications, {
                            title: 'Your Account is Disabled!',
                            message: 'Your account had not yet been enabled.' +
                                ' Check your inbox for a verification email or click this notification to request another one.',
                            type: NotificationType.ERROR,
                            action: () => {
                                api.requestNewActivationEmail(name).then(data => {
                                    setNotifications([...notifications, {
                                        title: 'Email Resent',
                                        message: 'Verification email had been resent.',
                                        type: NotificationType.SUCCESS,
                                    }])
                                }).catch(() => {
                                    setNotifications([...notifications, {
                                        title: 'Email Resend Failed',
                                        message: 'Verification email could not be sent at this time. Please try again later.',
                                        type: NotificationType.ERROR
                                    }])
                                })
                            }
                        }])
                    } else {
                        setNotifications([...notifications, {
                            title: 'Login Error',
                            message: 'Could not log you in. Please check your username/email and password and try again.',
                            type: NotificationType.ERROR,
                            timeout: 3500
                        }])
                    }
                });
            } else {
                api.requestResetPasswordEmail(name).finally(() => {
                    setNotifications([...notifications, {
                        title: 'Change Password Email Requested',
                        message: 'If account exists, an email will be sent with further instructions.',
                        type: NotificationType.INFO
                    }])
                });
            }
        }
    };

    if (!isLoggingIn) {
        return (
            <Container>
                <h3>{forgotPassword ? 'Forgot Password' : 'Login'}</h3>
                <Form style={{marginTop: '10px'}}>
                    <FormGroup row className={'align-items-center justify-content-center'}>
                        <Label for={'email-username-login'} xs={4} sm={2}>
                            Username or Email
                        </Label>
                        <Col xs={8} sm={10}>
                            <Input name={'email'} id={'email-username-login'} onChange={onEmailChange} placeholder={'Username or Email'}/>
                        </Col>
                    </FormGroup>
                    <Collapse isOpen={!forgotPassword}>
                        <FormGroup row className={'align-items-center justify-content-center'}>
                            <Label for={'password-login'} xs={4} sm={2}>
                                Password
                            </Label>
                            <Col xs={8} sm={10}>
                                <PasswordShowHide name={'password'} id={'password-login'} onChange={onPasswordChange} placeholder={'Password'}/>
                            </Col>
                        </FormGroup>
                        <FormGroup check className={'align-items-center justify-content-center'}>
                            <Label xs={'auto'} check><Input onChange={() => setRememberMe(!rememberMe)} type={'checkbox'}/> Remember Me</Label>
                        </FormGroup>
                    </Collapse>
                    <FormGroup row className={'align-items-center justify-content-center'}>
                        <Col>
                            <Beer4YourBuckBtn
                                customStyle={BtnType.PRIMARY}
                                onClick={(e) => {e.preventDefault();onSubmit();}}
                            >
                                {forgotPassword ? 'Email Me A Recovery Link' : 'Login'}
                            </Beer4YourBuckBtn>
                        </Col>
                    </FormGroup>
                    <FormGroup row className={'align-items-center justify-content-center'}>
                        <Col>
                            <Button color={'link'} onClick={() => setForgotPassword(!forgotPassword)}>{forgotPassword ? 'Back to login' : 'Forgot your password?'}</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </Container>
        )
    } else {
        return (
            <div>
                <LoadingSpinner message={'Logging In...'}/>
            </div>
        )
    }
}