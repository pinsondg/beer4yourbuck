import React, {useEffect, useState} from "react";
import {Input} from "reactstrap";
import classNames from "classnames";

interface VolumeInputProps {
    getVolume?: (volume: number) => void;
    text?: string;
    error?: boolean;
}

export default function VolumeInput(props: VolumeInputProps) {
    const [volume, setVolume] = useState<string>('');
    const [inFocus, setInFocus] = useState<boolean>(false);

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
        <Input className={classes} value={volume} placeholder={'Volume'} step={'0.01'} type={'number'} onChange={handleChange}/>
    )
}