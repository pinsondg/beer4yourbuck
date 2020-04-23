import React from "react";
import {AiOutlineLoading3Quarters} from "react-icons/all";
import './load-spinner.css'
import classNames from "classnames";

interface Props {
    message?: string
    className?: string
}

export function LoadingSpinner(props: Props) {

    const classes = classNames('processing-holder', props.className);

    return (
        <div className={classes}>
            <p>{props.message ? props.message : "Loading..."}</p>
            <AiOutlineLoading3Quarters size={42} className={'loading-icon'}/>
        </div>
    )
}