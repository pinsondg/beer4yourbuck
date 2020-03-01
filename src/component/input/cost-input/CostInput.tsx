import React, {ChangeEvent, useEffect, useState} from "react";
import {Input} from "reactstrap";
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
        <Input className={inputClasses} value={val} placeholder={'Cost'} step={'0.01'} type={'number'} onChange={handleChange}/>
    )
}