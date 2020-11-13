import React, {CSSProperties} from "react";
import {Button} from "reactstrap";
import {FaMapMarkerAlt} from "react-icons/fa";
import classNames from "classnames";
import './show-in-maps-button.scss'

interface Props {
    address: string
    className?: string
    style?: CSSProperties;
    iconSize?: number;
    text?: string;
}

const defaultIconSize = 20;

export default function ShowInMapsButton(props: Props) {

    const classes = classNames('maps-button', props.className);

    const showInMaps = () => {
        window.open("https://www.google.com/maps?q=" + props.address, '_blank');
    };

    return (
        <Button color={'info'} style={props.style} className={classes} onClick={showInMaps}>
            <p>
                <FaMapMarkerAlt size={props.iconSize ? props.iconSize : defaultIconSize}/>
                {props.text ? props.text : 'Show In Maps'}
            </p>
        </Button>
    )
}