import React from "react";
import {MdCheck, MdErrorOutline} from "react-icons/all";
import {Badge} from "reactstrap";
import './verification-badge.css'

export function VerifiedBadge() {
    return (
        <Badge color={'success'}><MdCheck/> Verified</Badge>
    )
}

export function UnverifiedBadge() {
    return (
        <Badge color={'danger'}><MdErrorOutline/> Unverified</Badge>
    )
}