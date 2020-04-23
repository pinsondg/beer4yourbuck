import React from "react";
import classNames from "classnames";
import './powered-by-untapped.css'
import untappedImage from '../../../image/untapped/pbu_40_grey.png'

interface Props {
    className?: string;
    text?: string;
}

export default function PoweredByUntapped(props: Props) {

    const classes = classNames('powered-by-untapped' , props.className);

    return (
        <div className={classes}>
            {props.text ? props.text : ''}
            <img className={'powered-by-untapped-image'} src={untappedImage} alt={'Powered by Untapped'}/>
        </div>
    )
}