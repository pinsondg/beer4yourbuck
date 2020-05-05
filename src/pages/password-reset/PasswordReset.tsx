import React, {useContext, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {Button, Container, Form, FormGroup} from "reactstrap";
import PasswordInput from "../../component/input/password-input/PasswordInput";
import {passwordRegex} from "../../controller/Utils";
import {NotificationContext, NotificationType} from "../../context/NotificationContext";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";

const api = Beer4YourBuckAPI.getInstance();

export default function PasswordReset() {
    const token = new URLSearchParams(useLocation().search).get("token");
    const history = useHistory();
    const {notifications, setNotifications} = useContext(NotificationContext);
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const handleResetPasswordSuccess = (data: any) => {
        setNotifications([...notifications, {
            title: 'Password Successfully Changed',
            message: 'Password change was successful. Redirecting to login.',
            type: NotificationType.SUCCESS,
            timeout: 3000
        }]);
        history.push('/login');
    };

    const handleResetPasswordError = (data: any) => {
        setNotifications([...notifications, {
            title: 'Error Changing Password.',
            message: 'There was an error changing your password. Please try again later.',
            type: NotificationType.ERROR,
            timeout: 3000
        }]);
    };

    const onSubmit = () => {
        if (newPassword !== '' && confirmPassword !== '' && passwordRegex.test(newPassword) && newPassword === confirmPassword) {
            console.log(`Change password token is: ${token}`);
            if (token) {
                api.resetPassword(token, newPassword).then(handleResetPasswordSuccess).catch(handleResetPasswordError);
            } else {
                api.resetPasswordUserLoggedIn(confirmPassword).then(handleResetPasswordSuccess).catch(handleResetPasswordError);
            }
        } else if (newPassword !== confirmPassword){
            setNotifications([...notifications, {
                title: 'Passwords Do Not Match',
                message: 'Your password and confirmed password do not match. Please try again',
                type: NotificationType.ERROR,
                timeout: 4000
            }]);
        } else if (newPassword === '' || confirmPassword === '') {
            setNotifications([...notifications, {
                title: 'Fields Cannot Be Empty',
                message: 'You must fill in both fields.',
                type: NotificationType.ERROR,
                timeout: 3000
            }]);
        } else if (!passwordRegex.test(newPassword)) {
            setNotifications([...notifications, {
                title: "Password Does Not Meet Guidelines",
                message: 'Your entered password does not meet our guidelines. Please review password guidelines and try again.',
                type: NotificationType.ERROR,
                timeout: 4000
            }]);
        }
    };

    return (
        <div>
            <Container>
                <h3>Change Password</h3>
                <Form>
                    <PasswordInput
                        onPasswordChange={val => setNewPassword(val)}
                        onConfirmPasswordChange={val => setConfirmPassword(val)}
                    />
                    <FormGroup row className={'justify-content-center align-items-center'}>
                        <Button onClick={onSubmit}>Change Password</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    )
}