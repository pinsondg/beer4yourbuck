import React from "react";
import {Button, Col, FormGroup, Input, Label, Row, UncontrolledCollapse} from "reactstrap";

interface Props {
    onPasswordChange: (val: string) => void;
    onConfirmPasswordChange: (val: string) => void;
}

export default function PasswordInput(props: Props) {

    return (
        <div>
            <FormGroup row className={'justify-content-center align-items-center'}>
                <Label xs={4} sm={2} for={'password'}>
                    Password
                </Label>
                <Col xs={8} sm={10}>
                    <Input type={'password'} name={'password'} id={'password'} placeholder={'Password'}
                           onChange={(e) => props.onPasswordChange(e.target.value)}/>
                </Col>
            </FormGroup>
            <FormGroup row className={'justify-content-center align-items-center'}>
                <Label xs={4} sm={2} for={'confirm-password'}>
                    Confirm Password
                </Label>
                <Col xs={8} sm={10}>
                    <Input type={'password'} name={'confirm-password'} id={'confirm-password'}
                           placeholder={'Confirm Password'} onChange={(e) => props.onConfirmPasswordChange(e.target.value)}/>
                </Col>
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
        </div>
    )
}