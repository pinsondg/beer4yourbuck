import React, {useEffect, useState} from "react";
import {Col, FormGroup, Input, Label} from "reactstrap";
import classNames from "classnames";

interface VolumeInputProps {
    getVolume?: (volume: number) => void;
    text?: string;
    error?: boolean;
}

export default function VolumeInput(props: VolumeInputProps) {
    const [volume, setVolume] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        var val = e.target.value;
        setVolume(val);
        if (props.getVolume) {
            props.getVolume(+val)
        }
    };

    const classes = classNames('custom-input', {'error': props.error});

    useEffect(() => {
        if (props.text) {
            setVolume(props.text);
        } else {
            setVolume('')
        }
    }, [props.text]);

    return (
        <FormGroup row>
            <Label for={'volume'} sm={'2'}>Volume (fl oz)</Label>
            <Col sm={'10'}>
                <Input
                    className={classes}
                    value={volume}
                    step={'0.01'}
                    type={'number'}
                    name={'volume'}
                    onChange={handleChange}/>
            </Col>
        </FormGroup>
    )
}