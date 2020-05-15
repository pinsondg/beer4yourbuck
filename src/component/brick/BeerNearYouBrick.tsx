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
                <Row>
                    <Col className={'beer-holder-2'} lg={'8'}>
                        <div className={'logo-holder'}>
                            <CircularBeerLogo
                                src={props.beer.label ? props.beer.label : Beer4YourBuckLogo}
                                alt={'Beer Logo'}
                            />
                        </div>
                        <div className={'beer-info-2'}>
                            <div className={'beer-heading'}>
                                <h4>{props.beer.name}</h4>
                                <h6>{props.beer.verified ? (<VerifiedBadge/>) : (<UnverifiedBadge/>)}</h6>
                            </div>
                            <div className={'beer-content'}>
                                <p>{props.beer.abv} %ABV - {props.beer.volume} fl. oz.</p>
                            </div>
                        </div>
                        <div className={'beer-price'}>
                            <h4>${props.beer.price}</h4>
                        </div>
                    </Col>
                    <Col lg={'4'}>
                        <h5>Found At: {props.venue.name}</h5>
                        <ShowInMapsButton address={props.venue.address}/>
                    </Col>
                </Row>
            </Container>
        </Jumbotron>
    )
}