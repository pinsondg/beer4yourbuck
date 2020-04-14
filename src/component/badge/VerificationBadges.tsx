import React, {CSSProperties} from "react";
import {MdCheck, MdErrorOutline} from "react-icons/all";
import {Badge} from "reactstrap";
import './verification-badge.css'

interface Props {
    className?: string;
    style?: CSSProperties;
}

export function VerifiedBadge(props: Props) {
    return (
        <Badge style={props.style} className={props.className} pill color={'success'}><MdCheck/> Verified</Badge>
    )
}

export function UnverifiedBadge(props: Props) {
    return (
        <Badge style={props.style} className={props.className} pill color={'danger'}><MdErrorOutline/> Unverified</Badge>
    )
}