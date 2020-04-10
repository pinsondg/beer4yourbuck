import React from "react";
import {AiOutlineLoading3Quarters} from "react-icons/all";
import './load-spinner.css'

interface Props {
    message?: string
}

export function LoadingSpinner(props: Props) {

    return (
        <div className={'processing-holder'}>
            <p>{props.message ? props.message : "Loading..."}</p>
            <AiOutlineLoading3Quarters size={42} className={'loading-icon'}/>
        </div>
    )
}