import React, {useContext, useEffect, useState} from "react";
import {BeerVenueContext} from "../../context/BeerVenueContext";
import {Badge, Button, Col, Container, Input, Row} from "reactstrap";
import './current-venue.css'
import {MdAdd} from "react-icons/md";
import {IoMdSearch} from "react-icons/io";
import BeerAddModal, {ModalType} from "../../component/modal/beerAdd/BeerAddModal";
import {Beer} from "../../model/Beer";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";
import {NotificationContext, NotificationType} from "../../context/NotificationContext";
import VenueBeerBrick from "../../component/brick/VenueBeerBrick";
import {UserContext} from "../../context/UserContext";
import RegistrationModal from "../../component/modal/RegistrationModal";
import {LoadingSpinner} from "../../component/load/LoadSpinner";
import {VenueLocationSelectorModal} from "../../component/modal/VenueLocationSelectorModal";

const api = Beer4YourBuckAPI.getInstance();

interface Props {
}

export default function CurrentVenue(props: Props) {
    const {venue, setVenue} = useContext(BeerVenueContext);
    const [sortedBeers, setSortedBeers] = useState<Beer[]>([]);
    const {notifications, setNotifications} = useContext(NotificationContext);
    const {user} = useContext(UserContext);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [upVotedBeers, setUpVotedBeers] = useState<Beer[]>([]);
    const [downVotedBeers, setDownVotedBeers] = useState<Beer[]>([]);
    const [userAddedBeers, setUserAddedBeers] = useState<Beer[]>([]);
    const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [noVeneusFound, setNoVenuesFound] = useState<boolean>();

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
        if (venue) {
            let sorted = [...venue.beers];
            sorted = sorted.map(x => new Beer.Builder().withBeer(x).build());
            sorted.sort((x, y) => {
                if (x.getOttawayScore() && y.getOttawayScore()) {
                    return y.getOttawayScore() - x.getOttawayScore();
                } else {
                    return 0;
                }
            });
            setSortedBeers(sorted);
        }
    }, [venue]);

    useEffect(() => {
        api.getUserBeerActivityInfo().then(data => {
            const upvoted: Beer[] = data.data.upvoted;
            const downvote: Beer[] = data.data.downvoted;
            const added: Beer[] = data.data.added;
            if (JSON.stringify(upvoted) !== JSON.stringify(upVotedBeers)) {
                setUpVotedBeers(upvoted)
            }
            if (JSON.stringify(downvote) !== JSON.stringify(downVotedBeers)) {
                setDownVotedBeers(downvote)
            }
            if (JSON.stringify(userAddedBeers) !== JSON.stringify(added)) {
                setUserAddedBeers(added);
            }
            setIsLoading(false);
        }).catch(err => {
            setIsLoading(false);
        });
    }, [upVotedBeers, downVotedBeers, userAddedBeers, venue]);

    const onAddBeerClicked = () => {
        if (user) {
            setShowAddModal(true);
        } else {
            setShowRegisterModal(true);
        }
    };

    if (venue) {
        return (
            <div className={'current-venue-content'}>
                <Container fluid={true}>
                    <Row className={'align-items-center top-row'}>
                        <Col xs={6} sm={'4'}>
                            <h5>{venue.name} <Badge color={'primary'}>{venue.venueType}</Badge></h5>
                        </Col>
                        <Col xs={6} sm={{offset: 4, size: 4}}>
                            <h6>Happy Hour: 5pm-7pm</h6>
                        </Col>
                    </Row>
                    <Row className={'justify-content-center top-row'}>
                        <Col xs={6} sm={6}>
                            <Button onClick={() => setVenue(null)}>Change Venue</Button>
                        </Col>
                        <Col xs={{size: 6}} sm={{offset: 2, size: 4}}>
                            <Button onClick={onAddBeerClicked} color={'success'}><MdAdd/> Add Beer</Button>
                        </Col>
                    </Row>
                    <Row className={'justify-content-center top-row'}>
                        <Col sm={4}>
                            <Input onChange={(e) => setSearchTerm(e.target.value)} placeholder={'Search Beer'}><IoMdSearch/></Input>
                        </Col>
                    </Row>
                </Container>
                <div className={'beers-list'}>
                    {
                        isLoading && <LoadingSpinner message={`Loading beers for ${venue.name}`}/>
                    }
                    {
                        sortedBeers.length > 0 && !isLoading ? sortedBeers.map((beer, i) => <VenueBeerBrick
                            key={beer.id}
                            beer={beer}
                            upVoted={upVotedBeers.some(voted => voted.id === beer.id)}
                            downVoted={downVotedBeers.some(voted => voted.id === beer.id)}
                            userAdded={userAddedBeers.some(added => added.id === beer.id)}
                            place={i + 1}
                        />).filter(item => item.props.beer.name.includes(searchTerm)) : (
                            <p>Looks like you're the first user here! Add beer to start comparing for this venue.</p>
                        )
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
                {showRegisterModal && <RegistrationModal
                    message={'With a Beer 4 Your Buck account, you can add different beers to a venue to compare ' +
                    'against other\'s that are there. Adding a beer to a venue helps other users find the best deals near them!'}
                    show={showRegisterModal}
                    onClose={() => setShowRegisterModal(false)}
                />}
            </div>
        )
    } else {
        return (
            <div>
                <VenueLocationSelectorModal onNoVenuesFound={() => setNoVenuesFound(true)}/>
                {noVeneusFound === undefined && <LoadingSpinner message={'Searching for possible venues near you...'}/>}
                {noVeneusFound && <h4>Could not find any venues near you.</h4>}
            </div>
        )
    }
}