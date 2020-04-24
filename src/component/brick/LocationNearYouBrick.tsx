import React from "react";
import {Col, Jumbotron, Row} from "reactstrap";
import {Beer} from "../../model/Beer";
import {BeerVenue} from "../../model/BeerVenue";
import './brick.css'
import './location-near-you-brick.css'
import './beer-item-brick.css'
import CircularBeerLogo from "../image/CircularBeerLogo";
import {UnverifiedBadge, VerifiedBadge} from "../badge/VerificationBadges";
import ShowInMapsButton from "../button/show-map-button/ShowInMapsButton";

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

    return (
        <Jumbotron className={'brick location-near-you'}>
            <Row>
                <Col md={'6'} className={'venue-info-holder'}>
                    <h5>{props.venue.name}</h5>
                    <p>{props.venue.address}</p>
                    <p>{props.distance.toFixed(2)} miles away</p>
                    <ShowInMapsButton address={props.venue.address}/>
                </Col>
                <Col md={'6'} className={'beer-info-holder'}>
                    <Row className={'beer-info-heading'}>
                        <Col xs={'auto'} style={{borderBottom: 'darkgray 1px solid'}}>
                            <h5>Beers 4 Your Buck</h5>
                        </Col>
                    </Row>
                    <Row className={'beer-list-holder'}>
                        <Col sm={'auto'} style={{width: '100%', margin: "auto", display: "flex", flexDirection: "column", overflow: "hidden"}}>
                        {
                            props.venue.beers.map(beer => new Beer.Builder().withBeer(beer).build()).sort(beerSort).slice(0, 3).map(beer =>
                                <div className={'beer-holder'}>
                                    <div className={'logo-holder location'}>
                                        <CircularBeerLogo
                                            src={beer.label ? beer.label : ''}
                                            alt={'Beer Logo'}
                                        />
                                    </div>
                                    <div className={'beer-text'}>
                                        {beer.name} - ${beer.price}
                                    </div>
                                    <div className={'badge-holder'}>
                                    {
                                        beer.verified && <VerifiedBadge/>
                                    }
                                    {
                                        !beer.verified && <UnverifiedBadge/>
                                    }
                                    </div>
                                </div>
                            )
                        }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Jumbotron>
    )
}