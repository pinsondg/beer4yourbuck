import React from "react";
import {Beer} from "../../model/Beer";
import {BeerVenue} from "../../model/BeerVenue";
import {Col, Container, Jumbotron, Row} from "reactstrap";
import './brick.css'
import {UnverifiedBadge, VerifiedBadge} from "../badge/VerificationBadges";
import './beer-near-you-brick.css'
import CircularBeerLogo from "../image/CircularBeerLogo";
import ShowInMapsButton from "../button/show-map-button/ShowInMapsButton";
import Beer4YourBuckLogo from "../../image/domain/logos/LogoMakr_3Klh9R.png";

interface Props {
    beer: Beer;
    venue: BeerVenue;
}

export function BeerNearYouBrick(props: Props) {

    return (
        <Jumbotron className={'brick'}>
            <Container>
                <Row className={'justify-content-center align-items-center'}>
                    <Col>
                        <p>Location: {props.venue.name}</p>
                    </Col>
                    <Col>
                        <p>{props.beer.verified ? (<VerifiedBadge/>) : (<UnverifiedBadge/>)}</p>
                    </Col>
                </Row>
                <Row className={'justify-content-center align-items-center'}>
                    <Col sm={2} style={{margin: '5px'}}>
                        <div className={'logo-holder'}>
                            <CircularBeerLogo
                                src={props.beer.label ? props.beer.label : Beer4YourBuckLogo}
                                alt={'Beer Logo'}
                            />
                        </div>
                    </Col>
                    <Col sm={8} style={{margin: '5px'}}>
                        <div>
                            <h4>{`${props.beer.name} ${props.beer.count && props.beer.count > 1 ? `(x${props.beer.count})` : ''}`}</h4>
                        </div>
                        <div>
                            <p>{props.beer.abv} %ABV - {props.beer.volume} fl. oz.</p>
                        </div>
                    </Col>
                    <Col sm={2} style={{margin: '5px'}}>
                        <h4>${props.beer.price ? props.beer.price.toFixed(2) : 'N/A'}</h4>
                    </Col>
                </Row>
                <Row className={'justify-content-center align-items-center'}>
                    <Col>
                        <ShowInMapsButton address={props.venue.address}/>
                    </Col>
                </Row>
            </Container>
        </Jumbotron>
    )
}