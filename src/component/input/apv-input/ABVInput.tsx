import React, {useEffect, useState} from "react";
import {Col, FormGroup, Input, Label} from "reactstrap";
import classNames from "classnames";
import '../input-style.css'

export interface APVInputProps {
    text: string;
    locked: boolean;
    getVal: (val: string) => void;
    error?: boolean
}

export default function ABVInput(props: APVInputProps) {
    const [text, setText] = useState<string>('');

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        var val = e.target.value;
        setText(val);
        props.getVal(val)
    };

    const inputClasses = classNames('custom-input', {'error' : props.error});

    useEffect(() => {
        setText(props.text);
    }, [props.text]);

    return (
        <FormGroup row>
            <Label for={'abv'} sm={'2'}>ABV (%)</Label>
            <Col sm={'10'}>
                <Input
                    className={inputClasses}
                    value={text}
                    type={'number'}
                    step={'0.01'}
                    onChange={onChange}
                    disabled={props.locked}
                    name={'abv'}
                />
            </Col>
        </FormGroup>
    )
}