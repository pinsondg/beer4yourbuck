import React from "react";
import {Beer} from "../../../model/Beer";
import {BeerVenue} from "../../../model/BeerVenue";
import {Col, Container, Jumbotron, Row} from "reactstrap";
import '../brick.css'
import './beer-near-you-brick.scss'
import CircularBeerLogo from "../../image/CircularBeerLogo";
import {UnverifiedBadge, VerifiedBadge} from "../../badge/VerificationBadges";

interface Props {
    beer: Beer;
    venue: BeerVenue;
}

export function BeerNearYouBrick(props: Props) {

    return (
        <Jumbotron className={'brick'}>
            <Container>
                <Row>
                    <Col xs={4}>
                        <div className={'logo-holder'}>
                            <CircularBeerLogo src={props.beer.label}/>
                        </div>
                        <div className={'badge-holder'}>
                            {
                                props.beer.verified ? <VerifiedBadge/> : <UnverifiedBadge/>
                            }
                        </div>
                    </Col>
                    <Col xs={8}>
                        <Row>
                            <Col className={'brick-text'}>
                                <h5>{`${props.beer.name} ${props.beer.count && props.beer.count > 1 ? `(x${props.beer.count})` : ''}`}</h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col className={'brick-text'}>
                                <h6>{props.beer.abv}% ABV - {props.beer.volume} oz</h6>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Jumbotron>
    )
}