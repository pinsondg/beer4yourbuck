import React, {ChangeEvent, CSSProperties, useState} from "react";
import {Input} from "reactstrap";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import classNames from "classnames";
import './PasswordShowHide.scss';

interface Props {
    className?: string;
    style?: CSSProperties;
    onChange?: (val: string) => void;
    placeholder?: string;
    name?: string;
    id?: string;
}

export default function PasswordShowHide(props: Props) {
    const [shouldShowPass, setShouldShowPass] = useState<boolean>(false);

    const classes = classNames('pass-show-hide-container', props.className);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (props.onChange) {
            props.onChange(e.target.value);
        }
    };

    const handleShowHideClick = () => {
        setShouldShowPass(!shouldShowPass);
    };

    return (
        <div className={classes} style={props.style}>
            <Input className={'text-input'} id={props.id} name={props.name} placeholder={props.placeholder} type={shouldShowPass ? 'text' : 'password'} onChange={handleTextChange}/>
            <div id={'show-hide-toggle'} className={'eye-icon-holder'} onClick={handleShowHideClick}>
                {
                    shouldShowPass ? <AiOutlineEyeInvisible size={20}/> : <AiOutlineEye size={20}/>
                }
            </div>
        </div>
    )
}