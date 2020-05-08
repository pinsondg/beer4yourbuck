import React, {ReactNode} from "react";
import {Col, FormGroup, Input, Label} from "reactstrap";

interface Props {
    onValueChange: (val: string) => void;
}

export function CountInput(props: Props) {

    const getCounts = (): ReactNode => {
        const options = [];
        for (let i = 1; i <= 100; i++) {
            options.push(<option>{i}</option>)
        }
        return options;
    };

    return (
        <FormGroup row>
            <Label sm={2} for="exampleSelect">Count</Label>
            <Col sm={10}>
                <Input onChange={(e) => props.onValueChange(e.target.value)} type="select" name="select" id="exampleSelect">
                    {getCounts()}
                </Input>
            </Col>
        </FormGroup>
    )
}