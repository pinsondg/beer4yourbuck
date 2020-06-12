import React from "react";
import {Button} from "reactstrap";
import {FaMapMarkerAlt} from "react-icons/fa";
import classNames from "classnames";

interface Props {
    address: string
    className?: string
}

export default function ShowInMapsButton(props: Props) {

    const classes = classNames('maps-button', props.className);

    const showInMaps = () => {
        window.open("https://www.google.com/maps?q=" + props.address, '_blank');
    };

    return (
        <Button color={'info'} className={classes} onClick={showInMaps}><FaMapMarkerAlt/> Show In Maps</Button>
    )
}