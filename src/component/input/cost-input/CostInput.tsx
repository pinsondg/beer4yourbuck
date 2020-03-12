import React, {useEffect, useState} from "react";
import {Col, FormGroup, Input, Label} from "reactstrap";
import classNames from "classnames";

interface CostInputProps {
    getCost: (cost: number) => void;
    text?: string;
    error?: boolean
}

export default function CostInput(props: CostInputProps) {
    const [val, setVal] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        var val = e.target.value;
        setVal(val);
        props.getCost(+val);
    };

    const inputClasses = classNames('custom-input', {'error': props.error});

    useEffect(() => {
        if (props.text) {
            setVal(props.text);
        } else {
            setVal('')
        }
    }, [props.text]);

    return (
        <FormGroup row>
            <Label for={'cost'} sm={'2'}>Cost ($)</Label>
            <Col sm={'10'}>
                <Input
                    id={'cost'}
                    className={inputClasses}
                    value={val}
                    step={'0.01'}
                    type={'number'}
                    onChange={handleChange}
                    name={'cost'}
                />
            </Col>
        </FormGroup>)
}