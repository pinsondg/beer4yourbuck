import React from "react";
import {Beer} from "../../model/Beer";
import {BeerVenue} from "../../model/BeerVenue";
import {Col, Jumbotron, Row} from "reactstrap";
import './brick.css'
import {UnverifiedBadge, VerifiedBadge} from "../badge/VerificationBadges";
import './beer-near-you-brick.css'
import CircularBeerLogo from "../image/CircularBeerLogo";

interface Props {
    beer: Beer;
    venue: BeerVenue;
}

export function BeerNearYouBrick(props: Props) {

    return (
        <Jumbotron className={'brick'}>
            <Row>
                <Col className={'beer-holder-2'} lg={'8'}>
                    <div className={'logo-holder'}>
                        <CircularBeerLogo
                            src={props.beer.label ? props.beer.label : ''}
                            alt={'Beer Logo'}
                        />
                    </div>
                    <div className={'beer-info-2'}>
                        <div className={'beer-heading'}>
                            <h1>{props.beer.name}</h1>
                            <h6>{props.beer.verified ? (<VerifiedBadge/>) : (<UnverifiedBadge/>)}</h6>
                        </div>
                        <div className={'beer-content'}>
                            <h5>{props.beer.abv} %ABV - {props.beer.volume} fl. oz.</h5>
                        </div>
                    </div>
                    <div className={'beer-price'}>
                        <h1>${props.beer.price}</h1>
                    </div>
                </Col>
                <Col lg={'4'}>
                    <h3>Location</h3>
                    <h4>{props.venue.name}</h4>
                </Col>
            </Row>
        </Jumbotron>
    )
}