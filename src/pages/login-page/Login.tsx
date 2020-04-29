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
        console.log(`Username/Email: ${name} Password: ${password}`);
        api.login(name, password, rememberMe).then(data => {
            api.getUserDetails().then(data => {
                console.log(data.data);
                setUser(data.data);
                history.push('/')
            });
        }).catch(err => {
            console.log(err);
            setNotifications([...notifications, {
                title: 'Login Error',
                message: 'Could not log you in. Please check your username/email and password and try again.',
                type: NotificationType.ERROR,
                timeout: 4000
            }])
        });
    };

    return (
        <Container>
            <h3>Login</h3>
            <Form>
                <FormGroup row className={'align-items-center justify-content-center'}>
                    <Label for={'email-username-login'} xs={4}>
                        Username or Email
                    </Label>
                    <Col xs={8}>
                        <Input name={'email'} id={'email-username-login'} onChange={onEmailChange} placeholder={'Username or Email'}/>
                    </Col>
                </FormGroup>
                <FormGroup row className={'align-items-center justify-content-center'}>
                    <Label for={'password-login'} xs={4}>
                        Password
                    </Label>
                    <Col xs={8}>
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