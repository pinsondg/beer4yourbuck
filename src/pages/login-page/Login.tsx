import React, {useContext, useState} from "react";
import {Button, Col, Container, Form, FormGroup, Input, Label} from "reactstrap";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";
import {useHistory} from "react-router-dom";
import {NotificationContext, NotificationType} from "../../context/NotificationContext";
import {UserContext} from "../../context/UserContext";

interface Props {

}

const api = new Beer4YourBuckAPI();

export default function Login(props: Props) {
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const history = useHistory();
    const {notifications, setNotifications} = useContext(NotificationContext);
    const {user, setUser} = useContext(UserContext);

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        var val = e.target.value;
        setName(val);
    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        var val = e.target.value;
        setPassword(val);
    };

    const onSubmit = () => {
        api.login(name, password, rememberMe).then(data => {
            api.getUserDetails().then(data => {
                setUser(data.data);
                history.push('/')
            });
        }).catch(err => {
            console.log(err);
            if (err.response.data && err.response.data.exception === 'User is disabled') {
                setNotifications([...notifications, {
                    title: 'Your Account is Disabled!',
                    message: 'Your account had not yet been enabled.' +
                        ' Check your inbox for a verification email or click this notification to request another one.',
                    type: NotificationType.ERROR,
                    action: () => {
                        api.requestNewEmail(name).then(data => {
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
    };

    return (
        <Container>
            <h3>Login</h3>
            <Form>
                <FormGroup row className={'align-items-center justify-content-center'}>
                    <Label for={'email-username-login'} xs={4} sm={2}>
                        Username or Email
                    </Label>
                    <Col xs={8} sm={10}>
                        <Input name={'email'} id={'email-username-login'} onChange={onEmailChange} placeholder={'Username or Email'}/>
                    </Col>
                </FormGroup>
                <FormGroup row className={'align-items-center justify-content-center'}>
                    <Label for={'password-login'} xs={4} sm={2}>
                        Password
                    </Label>
                    <Col xs={8} sm={10}>
                        <Input type={'password'} name={'password'} id={'password-login'} onChange={onPasswordChange} placeholder={'Password'}/>
                    </Col>
                </FormGroup>
                <FormGroup check className={'align-items-center justify-content-center'}>
                    <Label check><Input onChange={() => setRememberMe(!rememberMe)} type={'checkbox'}/> Remember Me</Label>
                </FormGroup>
                <FormGroup row className={'align-items-center justify-content-center'}>
                    <Col>
                        <Button color={'primary'} onClick={onSubmit}>Login</Button>
                    </Col>
                </FormGroup>
            </Form>
        </Container>
    )
}