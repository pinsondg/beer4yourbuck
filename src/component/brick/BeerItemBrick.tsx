import React, {useEffect, useState} from "react";
import {Beer} from "../../model/Beer";
import {Button, Col, Jumbotron, Row} from "reactstrap";
import classNames from "classnames";
import './beer-item-brick.css'
import {BeerVenue} from "../../model/BeerVenue";
import {isMobile} from "../../controller/Utils";
import './brick.css'
import CircularBeerLogo from "../image/CircularBeerLogo";
import {LoadingSpinner} from "../load/LoadSpinner";
import Beer4YourBuckLogo from "../../image/domain/logos/LogoMakr_3Klh9R.png";

export default interface Props {
    beer: Beer;
    venue?: BeerVenue;
    id: string;
    onEditSelect: (id: string) => void;
    onDeleteSelect: (id: string) => void;
    isDeletable?: boolean;
    isEditable?: boolean
    place: Place;
    onPublish?: (id: string) => void;
}

export enum Place {
    FIRST, SECOND, THIRD, NONE, INVALID
}

export function BeerItemBrick(props: Props) {
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [published, setPublished] = useState<boolean>(false);
    const [isPublishing, setIsPublishing] = useState<boolean>(false);

    const classes = classNames('brick', {
        'first': props.place === Place.FIRST,
        'second' : props.place === Place.SECOND,
        'third' : props.place === Place.THIRD,
        'invalid' : props.place === Place.INVALID
    });

    const placeClasses = classNames('place-div', {
        'show': props.place !== Place.INVALID && props.place !== Place.NONE
    });

    const handleEditClick = () => {
        props.onEditSelect(props.id);
    };

    const handleDeleteClick = () => {
        props.onDeleteSelect(props.id)
    };

    const determinePlace = () => {
        let retString = '';
        switch (props.place) {
            case Place.FIRST:
                retString = '1st';
                break;
            case Place.SECOND:
                retString = '2nd';
                break;
            case Place.THIRD:
                retString = '3rd';
                break;
        }
        return retString;
    };

    useEffect(() => {
        setPublished(props.beer.isPublished ? props.beer.isPublished : false);
        setIsPublishing(false);
    }, [props]);

    const onPublishClick = () => {
        if (props.onPublish) {
            setIsPublishing(true);
            props.onPublish(props.id);
        }
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
            <div className={placeClasses}>
                <h3>
                    {determinePlace()}
                </h3>
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
                    <CircularBeerLogo
                        height={100}
                        width={100}
                        src={props.beer.label ? props.beer.label : Beer4YourBuckLogo}
                        alt={'Beer Logo'}
                    />
                </Col>
                <Col xs={'auto'} className={'section'}>
                    <h1>{props.beer.name}</h1>
                    <h5>{props.beer.abv ? props.beer.abv : 'N/A'}% ABV - {props.beer.volume ? props.beer.volume : 'N/A'} fl oz</h5>
                    <h5>{props.venue && props.venue.name ? 'Location: ' + props.venue.name : ''}</h5>
                    <Button hidden={!(!!props.onPublish) || published || isPublishing} onClick={onPublishClick}>Publish</Button>
                    {
                        isPublishing && <LoadingSpinner message={`Publishing...`}/>
                    }
                </Col>
                <Col xs={'auto'} className={'section'}>
                    <h1>${props.beer.price ? props.beer.price.toPrecision(3) : 'N/A'}</h1>
                </Col>
            </Row>
        </Jumbotron>
    )
}
