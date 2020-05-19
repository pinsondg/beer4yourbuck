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
import classNames from "classnames";
import {isMobile} from "../../controller/Utils";

interface Props {
    beer: Beer;
    venue: BeerVenue;
}

export function BeerNearYouBrick(props: Props) {

    const beerInfoHolderClassname = classNames('beer-holder-2', {
        'mobile': isMobile()
    });

    return (
        <Jumbotron className={'brick'}>
            <div style={{position: "absolute", top: '0', left: '0', margin: '5px'}}>
                <p>{props.venue.name}</p>
            </div>
            <div style={{position: "absolute", top: '0', right: '0', margin: '5px', maxWidth: '50%'}}>
                <p>{props.beer.verified ? (<VerifiedBadge/>) : (<UnverifiedBadge/>)}</p>
            </div>
            <Container>
                <Row>
                    <Col className={beerInfoHolderClassname} lg={'8'}>
                        <div className={'logo-holder'}>
                            <CircularBeerLogo
                                src={props.beer.label ? props.beer.label : Beer4YourBuckLogo}
                                alt={'Beer Logo'}
                            />
                        </div>
                        <div className={'beer-info-2'}>
                            <div className={'beer-heading'}>
                                <h4>{props.beer.name}</h4>
                            </div>
                            <div className={'beer-content'}>
                                <p>{props.beer.abv} %ABV - {props.beer.volume} fl. oz.</p>
                            </div>
                        </div>
                        <div className={'beer-price'}>
                            <h4>${props.beer.price ? props.beer.price.toFixed(2) : 'N/A'}</h4>
                        </div>
                    </Col>
                    <Col lg={'4'}>
                        <ShowInMapsButton address={props.venue.address}/>
                    </Col>
                </Row>
            </Container>
        </Jumbotron>
    )
}