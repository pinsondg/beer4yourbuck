import React, {CSSProperties} from "react";
import {MdCheck, MdErrorOutline} from "react-icons/md";
import {Badge} from "reactstrap";
import './verification-badge.css'
import classNames from "classnames";

interface Props {
    className?: string;
    style?: CSSProperties;
}

export function VerifiedBadge(props: Props) {

    const classes = classNames('custom-badge', props.className);

    return (
        <Badge style={props.style} className={classes} pill color={'success'}><MdCheck/> Verified</Badge>
    )
}

export function UnverifiedBadge(props: Props) {

    const classes = classNames('custom-badge', props.className);

    return (
        <Badge style={props.style} className={classes} pill color={'danger'}><MdErrorOutline/> Unverified</Badge>
    )
}