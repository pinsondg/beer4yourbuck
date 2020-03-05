import React, {useEffect, useState} from "react";
import {Input} from "reactstrap";
import classNames from "classnames";
import '../input-style.css'

export interface APVInputProps {
    text: string;
    locked: boolean;
    getVal: (val: string) => void;
    error?: boolean
}

export default function APVInput(props: APVInputProps) {
    const [text, setText] = useState<string>('');

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        var val = e.target.value;
        setText(val);
    };

    const inputClasses = classNames('custom-input', {'error' : props.error});

    useEffect(() => {
        setText(props.text);
    }, [props.text]);

    return (
        <Input
            className={inputClasses}
            value={text}
            placeholder={'% APV'}
            type={'number'}
            step={'0.01'}
            onChange={onChange}
            disabled={props.locked}
            name={'apv'}
        />
    )
}