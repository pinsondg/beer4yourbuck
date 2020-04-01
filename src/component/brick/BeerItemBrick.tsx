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
    onDeleteSelect: (id: string) => void;
    isDeletable?: boolean;
    isEditable?: boolean
    place: Place;
}

export enum Place {
    FIRST, SECOND, THIRD, NONE, INVALID
}

export function BeerItemBrick(props: Props) {
    const [isHovering, setIsHovering] = useState<boolean>(false);

    const classes = classNames('beer-item-brick', {
        'first': props.place === Place.FIRST,
        'second' : props.place === Place.SECOND,
        'third' : props.place === Place.THIRD,
        'invalid' : props.place === Place.INVALID
    });

    const handleEditClick = () => {
        props.onEditSelect(props.id);
    };

    const handleDeleteClick = () => {
        props.onDeleteSelect(props.id)
    };

    return (
        <Jumbotron className={classes} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <div className={'edit-button-div'}>
                {(props.isEditable && (isHovering || isMobile()))
                && <button className={'edit-button'} onClick={handleEditClick}>Edit</button>}
                {(props.isEditable && props.isDeletable) && (isHovering || isMobile()) && <span>|</span>}
                {(props.isDeletable && (isHovering || isMobile()))
                && <button className={'edit-button'} onClick={handleDeleteClick}>Delete</button>}
            </div>
            {
                props.place === Place.INVALID && <Row>
                    <Col xs={'auto'} className={'section'}>
                        <h2 color={'darkred'}>INVALID BEER - PLEASE EDIT TO FIX OR ENTER MANUALLY</h2>
                    </Col>
                </Row>
            }
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
                    <h5>{props.beer.abv ? props.beer.abv : 'N/A'}% ABV - {props.beer.volume ? props.beer.volume : 'N/A'} fl oz</h5>
                    <h5>{props.venue && props.venue.name ? 'Location: ' + props.venue.name : ''}</h5>
                </Col>
                <Col xs={'auto'} className={'section'}>
                    <h1>${props.beer.price ? props.beer.price.toPrecision(3) : 'N/A'}</h1>
                </Col>
            </Row>
        </Jumbotron>
    )
}
