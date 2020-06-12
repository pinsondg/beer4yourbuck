import React from "react";
import {Badge, Col, Container, Jumbotron, Row} from "reactstrap";
import {Beer} from "../../model/Beer";
import {BeerVenue} from "../../model/BeerVenue";
import './brick.css'
import './location-near-you-brick.css'
import './beer-item-brick.css'
import CircularBeerLogo from "../image/CircularBeerLogo";
import {UnverifiedBadge, VerifiedBadge} from "../badge/VerificationBadges";
import ShowInMapsButton from "../button/show-map-button/ShowInMapsButton";
import {isMobile} from "../../controller/Utils";
import classNames from "classnames";

export default interface Props {
    venue: BeerVenue;
    distance: number;
}

export function LocationNearYouBrick(props: Props) {

    const beerSort = (x: Beer, y: Beer) => {
        if (x.getOttawayScore() && y.getOttawayScore()) {
            return y.getOttawayScore() - x.getOttawayScore();
        } else {
            return 0;
        }
    };

    const venueInfoHolderClasses = classNames('venue-info-holder', {
        'mobile': isMobile()
    });

    return (
        <Jumbotron className={'brick location-near-you'}>
            <Container>
                <Row>
                    <Col md={'6'} className={venueInfoHolderClasses}>
                        <h5>{props.venue.name}<br/><Badge color={'primary'}>{props.venue.venueTypes.join('/')}</Badge></h5>
                        <p>{props.venue.address}</p>
                        <p>{props.distance.toFixed(2)} miles away</p>
                        <ShowInMapsButton address={props.venue.address}/>
                    </Col>
                    <Col md={'6'} className={'beer-info-holder'}>
                        <Row style={{margin: '0 auto'}} className={'beer-info-heading'}>
                            <Col xs={'auto'} style={{borderBottom: 'darkgray 1px solid'}}>
                                <h5>Beers 4 Your Buck</h5>
                            </Col>
                        </Row>
                        <Row style={{margin: '0 auto'}} className={'beer-list-holder'}>
                            <Col sm={'auto'} style={{width: '100%', margin: "auto", display: "flex", flexDirection: "column", overflow: "hidden"}}>
                            {
                                props.venue.beers.map(beer => new Beer.Builder().withBeer(beer).build()).sort(beerSort).slice(0, 3).map(beer =>
                                    <Row className={'justify-content-center align-items-center'} style={{marginTop: '10px'}}>
                                        <Col md={4} lg={4} xl={4} style={{display: 'flex', justifyContent: 'center'}}>
                                            <div className={'logo-holder location'}>
                                                <CircularBeerLogo
                                                    src={beer.label ? beer.label : ''}
                                                    alt={'Beer Logo'}
                                                />
                                            </div>
                                        </Col>
                                        <Col md={4} lg={4} xl={4}>
                                            <h6>{beer.name}{beer.count && beer.count > 1 ? ` (x${beer.count})` : ''}</h6>
                                            <h6>${beer.price ? beer.price.toFixed(2) : 'N/A'}</h6>
                                        </Col>
                                        <Col>
                                        {
                                            beer.verified && <VerifiedBadge/>
                                        }
                                        {
                                            !beer.verified && <UnverifiedBadge/>
                                        }
                                        </Col>
                                    </Row>
                                )
                            }
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Jumbotron>
    )
}