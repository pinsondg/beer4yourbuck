import React, {useContext, useEffect, useState} from "react";
import {BeerVenueContext} from "../../context/BeerVenueContext";
import {Badge, Button, Col, Container, Row} from "reactstrap";
import './current-venue.css'
import {MdAdd} from "react-icons/all";
import BeerAddModal, {ModalType} from "../../component/modal/beerAdd/BeerAddModal";
import {Beer} from "../../model/Beer";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";
import {NotificationContext, NotificationType} from "../../context/NotificationContext";
import VenueBeerBrick from "../../component/brick/VenueBeerBrick";

const api = new Beer4YourBuckAPI();

interface Props {
}

export default function CurrentVenue(props: Props) {
    const {venue, setVenue} = useContext(BeerVenueContext);
    const {notifications, setNotifications} = useContext(NotificationContext);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [upVotedBeers, setUpVotedBeers] = useState<Beer[]>([]);
    const [downVotedBeers, setDownVotedBeers] = useState<Beer[]>([]);

    const onBeerAdded = (beer: Beer) => {
        if (venue) {
            api.addBeersToVenue(venue, [beer]).then(data => setVenue(data.data)).catch(() => setNotifications([...notifications, {
                title: 'Error Adding Beer To Venue',
                message: `We could not add ${beer.name} to ${venue.name} at this time. Please try again later`,
                timeout: 5000,
                type: NotificationType.ERROR
            }]));
        }
        setShowAddModal(false);
    };

    useEffect(() => {
        api.getVotedBeers().then(data => {
            const upvoted: Beer[] = data.data.upvoted;
            const downvote: Beer[] = data.data.downvoted;
            if (JSON.stringify(upvoted) !== JSON.stringify(upVotedBeers)) {
                setUpVotedBeers(upvoted)
            }
            if (JSON.stringify(downvote) !== JSON.stringify(downVotedBeers)) {
                setUpVotedBeers(downvote)
            }
        });
    }, [upVotedBeers, downVotedBeers]);

    if (venue) {
        return (
            <div className={'current-venue-content'}>
                <Container fluid={true}>
                    <Row className={'align-items-center'}>
                        <Col xs={6} sm={'4'}>
                            <h5>{venue.name} <Badge color={'primary'}>{venue.venueType}</Badge></h5>
                        </Col>
                        <Col xs={6} sm={{offset: 4, size: 4}}>
                            <h6>Happy Hour: 5pm-7pm</h6>
                        </Col>
                    </Row>
                    <Row className={'align-items-center'}>
                        <Col xs={{offset: 6, size: 6}} sm={{offset: 8, size: 4}}>
                            <Button onClick={() => setShowAddModal(true)} color={'success'}><MdAdd/> Add Beer</Button>
                        </Col>
                    </Row>
                </Container>
                <div className={'beers-list'}>
                    {
                        venue.beers.map(beer => <VenueBeerBrick
                            key={beer.id}
                            beer={beer}
                            upVoted={upVotedBeers.some(voted => voted.id === beer.id)}
                            downVoted={downVotedBeers.some(voted => voted.id === beer.id)}
                        />)
                    }
                </div>
                {showAddModal &&
                    <BeerAddModal
                        modalType={ModalType.ADD}
                        show={showAddModal}
                        onConfirm={onBeerAdded}
                        onClose={() => setShowAddModal(false)}
                    />
                }
            </div>
        )
    } else {
        return (
            <div>Error</div>
        )
    }
}