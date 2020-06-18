import React, {CSSProperties} from "react";
import './load-spinner.css'
import classNames from "classnames";
import BeerGlassLoader from "./beer-glass-loader/BeerGlassLoader";

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
            <BeerGlassLoader style={{width: '100%', margin: '0 auto'}}/>
        </div>
    )
}