import React, {CSSProperties} from "react";
import {AiOutlineLoading3Quarters} from "react-icons/ai";
import './load-spinner.css'
import classNames from "classnames";

interface Props {
    message?: string;
    className?: string;
    style?: CSSProperties;
    spinnerSize?: number
}

export function LoadingSpinner(props: Props) {

    const classes = classNames('processing-holder', props.className);

    return (
        <div style={props.style} className={classes}>
            <p>{props.message ? props.message : "Loading..."}</p>
            <AiOutlineLoading3Quarters size={props.spinnerSize ? props.spinnerSize : 42} className={'loading-icon'}/>
        </div>
    )
}