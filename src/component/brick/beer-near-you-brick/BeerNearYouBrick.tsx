import React from "react";
import {Beer} from "../../../model/Beer";
import {BeerVenue} from "../../../model/BeerVenue";
import {Jumbotron} from "reactstrap";
import '../brick.css'
import './beer-near-you-brick.scss'
import CircularBeerLogo from "../../image/CircularBeerLogo";
import {VerifiedBadge} from "../../badge/VerificationBadges";
import {FaMapMarkerAlt} from "react-icons/fa";
import ValueScoreBadge from "../../badge/value-score-badge/ValueScoreBadge";
import Beer4YourBuckLogo from "../../../image/domain/logos/LogoMakr_3Klh9R.png";


interface Props {
    beer: Beer;
    venue: BeerVenue;
}

export function BeerNearYouBrick(props: Props) {

    return (
        <Jumbotron className={'brick'}>
            <div className={'near-you-brick-content'}>
                <div className={'left-content'}>
                    <div className={'logo-holder'}>
                        <CircularBeerLogo src={props.beer.label ? props.beer.label : Beer4YourBuckLogo}/>
                    </div>
                    <div className={'value-score-container'}>
                        <ValueScoreBadge className={'score-badge'} score={props.beer.getOttawayScore()}/>
                    </div>
                </div>
                <div className={'main-content'}>
                    <div className={'beer-name-container'}>
                        <h5>{props.beer.name}{props.beer.count && props.beer.count > 1 ? ` (x${props.beer.count})` : ''}</h5>
                        {
                            props.beer.verified ? <VerifiedBadge style={{marginLeft: '5px'}}/> : null
                        }
                    </div>
                    <div className={'beer-properties-container'}>
                        <p>{props.beer.abv}% ABV - {props.beer.volume}oz - ${props.beer.price ? props.beer.price.toFixed(2) : 'N/A'}</p>
                    </div>
                    <div className={'location-container'}>
                        <FaMapMarkerAlt style={{marginRight: '5px', color: '#f6c101'}} size={15}/><p>{props.venue.name} (<a rel='noopener noreferrer' href={"https://www.google.com/maps?q=" + props.venue.address} target='_blank'>Map</a>)</p>
                    </div>
                </div>
            </div>
        </Jumbotron>
    )
}