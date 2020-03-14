import React, {useState} from "react";
import {Beer} from "../../model/Beer";
import {Col, Jumbotron, Row} from "reactstrap";
import classNames from "classnames";
import './beer-item-brick.css'
import {BeerVenue} from "../../model/BeerVenue";
import {isMobile} from "../../controller/Utils";

export default interface Props {
    beer: Beer;
    venue?: BeerVenue;
    id: string;
    onEditSelect: (id: string) => void;
    isEditable?: boolean
    place: Place;
}

export enum Place {
    FIRST, SECOND, THIRD, NONE
}

export function BeerItemBrick(props: Props) {
    const [isHovering, setIsHovering] = useState<boolean>(false);

    const classes = classNames('beer-item-brick', {
        'first': props.place === Place.FIRST,
        'second' : props.place === Place.SECOND,
        'third' : props.place === Place.THIRD
    });

    const handleEditClick = () => {
        props.onEditSelect(props.id);
    };

    return (
        <Jumbotron className={classes} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <Row>
                <Col xs={'auto'} className={'section'}>
                    <img
                        className={'beer-logo'}
                        src={props.beer.labels ? props.beer.labels.contentAwareMedium : ''}
                        alt={'Beer Logo'}
                        height={100}
                        width={100}
                    />
                </Col>
                <Col xs={'auto'} className={'section'}>
                    <h1>{props.beer.name}</h1>
                    <h5>{props.beer.abv}% ABV - {props.beer.volume + ' fl oz'}</h5>
                    <h5>{props.venue && props.venue.name ? 'Location: ' + props.venue.name : ''}</h5>
                </Col>
                <Col xs={'auto'} className={'section'}>
                    <h1>${props.beer.price ? props.beer.price.toPrecision(3) : 'N/A'}</h1>
                </Col>
                {(props.isEditable && (isHovering || isMobile()))
                && <button className={'edit-button'} onClick={handleEditClick}>Edit</button>}
            </Row>
        </Jumbotron>
    )
}
