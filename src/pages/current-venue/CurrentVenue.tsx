import React, {ReactNode, useContext, useEffect, useRef, useState} from "react";
import {BeerVenueContext} from "../../context/BeerVenueContext";
import {Badge, Button, Col, Container, Input, Row} from "reactstrap";
import './current-venue.css'
import {MdAdd} from "react-icons/md";
import {IoMdSearch} from "react-icons/io";
import BeerAddModal, {ModalType} from "../../component/modal/beerAdd/BeerAddModal";
import {Beer} from "../../model/Beer";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";
import {NotificationContext, NotificationType} from "../../context/NotificationContext";
import VenueBeerBrick from "../../component/brick/venue-beer-brick/VenueBeerBrick";
import {UserContext} from "../../context/UserContext";
import RegistrationModal from "../../component/modal/RegistrationModal";
import {LoadingSpinner} from "../../component/load/LoadSpinner";
import {VenueLocationSelectorModal} from "../../component/modal/VenueLocationSelectorModal";
import {Beer4YourBuckBtn, BtnType} from "../../component/button/custom-btns/ThemedButtons";
import {DateTime} from "luxon";
import TimeChooseModal from "../../component/modal/timeChooser/TimeChooseModal";
import ReactConfetti from "react-confetti";
import {CurrentContentRef} from "../../context/CurrentContentRef";

const api = Beer4YourBuckAPI.getInstance();

interface Props {
}

interface IIndexible {
    [key: string] : number
}

const sorter: IIndexible = {
    "sunday": 0, // << if sunday is first day of week
    "monday": 1,
    "tuesday": 2,
    "wednesday": 3,
    "thursday": 4,
    "friday": 5,
    "saturday": 6
};

export function formatDaysOfWeek(days: string[]): string {
    days.sort((a, b) => {
        let day1 = a.toLowerCase();
        let day2 = b.toLowerCase();
        return sorter[day1] - sorter[day2];
    });
    let daysPrint = '';
    for (let i = 0; i < days.length; i++) {
        let z = i + 1;
        if (z >= days.length) {
            daysPrint += `${days[i].substring(0, 3)}`;
            break;
        }
        let curr = sorter[days[i].toLowerCase()];
        let next = sorter[days[z].toLowerCase()];
        while (curr + (z - i) === next) {
            z++;
            if (z >= days.length) {
                break;
            }
            next = sorter[days[z].toLowerCase()];
        }
        if (z === i + 1) {
            daysPrint += `${days[i].substring(0, 3)}, `;
        } else {
            if (sorter[days[i].toLowerCase()] + 1 === sorter[days[z - 1].toLowerCase()]) {
                daysPrint += `${days[i].substring(0, 3)}, ${days[z - 1].substring(0, 3)}, `;
            } else {
                daysPrint += `${days[i].substring(0, 3)}-${days[z - 1].substring(0, 3)}, `;
            }
        }
        i = z - 1;
    }
    daysPrint = daysPrint.trim();
    if (daysPrint.lastIndexOf(',') === daysPrint.length - 1) {
        daysPrint = daysPrint.substring(0, daysPrint.length  - 1);
    }
    return daysPrint;
}

export default function CurrentVenue(props: Props) {
    const {contentRef, setContentRef} = useContext(CurrentContentRef);
    const  currentVenueContentRef = useRef(null);
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
    const [noVenuesFound, setNoVenuesFound] = useState<boolean>();
    const [showHHReporter, setShowHHReporter] = useState<boolean>(false);
    const [isHappyHour, setIsHappyHour] = useState<boolean>(false);
    const [editBeer, setEditBeer] = useState<Beer | null>(null);

    const updateVenue = () => {
        if (venue) {
            api.getVenueById(venue.id).then(data => {
                setVenue(data.data);
            }).catch((e) => {
                console.log(JSON.stringify(e));
            })
        }
    };

    const onBeerAdded = (beer: Beer) => {
        if (venue) {
            api.addBeersToVenue(venue, [beer]).then(updateVenue)
                .catch(() => setNotifications([...notifications, {
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
            const {happyHourDayOfWeek, happyHourStart, happyHourEnd} = venue;
            if (happyHourDayOfWeek && happyHourStart && happyHourEnd) {
                try {
                    const isDay = happyHourDayOfWeek.map(day => sorter[day.toLowerCase()]).includes(new Date().getDay());
                    const startTime = DateTime.fromISO(happyHourStart);
                    const endTime = DateTime.fromISO(happyHourEnd);
                    const now = DateTime.local();
                    const isTime = startTime <= now && now >= endTime;
                    setIsHappyHour(isDay && isTime);
                } catch (e) {
                    console.error(e);
                    setIsHappyHour(false);
                }
            }
        } else {
            setIsHappyHour(false);
        }
    }, [venue]);


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

    const getHappyHourTime = (): ReactNode => {
        if (venue && venue.happyHourStart && venue.happyHourEnd && venue.happyHourDayOfWeek) {
            return <h6>{`Happy Hour: ${DateTime.fromISO(venue.happyHourStart).toLocaleString(DateTime.TIME_SIMPLE)}-${DateTime.fromISO(venue.happyHourEnd).toLocaleString(DateTime.TIME_SIMPLE)} ${formatDaysOfWeek(venue.happyHourDayOfWeek)}`}</h6>;
        } else {
            return (
                <div>
                    <p>Happy Hour:<br/>Not Reported</p>
                    <Button color={'link'} onClick={() => {
                        if (user) {
                            setShowHHReporter(true);
                        } else {
                            setShowRegisterModal(true);
                        }
                    }}>Click to report</Button>
                </div>
            )
        }
    };

    useEffect(() => {
        setContentRef(currentVenueContentRef);
    });

    const handleBeerEdit = (beer: Beer) => {
        setEditBeer(beer);
    };

    const onBeerEditConfirm = (updated: Beer) => {
        api.updateBeer(updated).then(data => {
            setNotifications([...notifications, {
                type: NotificationType.SUCCESS,
                title: 'Successfully Updated Beer!',
                message: `Updated ${updated.name} successfully.`,
                timeout: 4000
            }]);
            updateVenue();
        }).catch(e => {
            setNotifications([...notifications, {
                type: NotificationType.ERROR,
                title: 'Error Updating Beer',
                message: `There was an error updating ${updated.name}. Please try again later.`,
                timeout: 5000
            }]);
        }).finally(() => {
            setEditBeer(null);
        });
    };

    if (venue) {
        return (
            <div className={'current-venue-content'} ref={contentRef}>
                <TimeChooseModal onSubmitSuccess={updateVenue} onClose={() => setShowHHReporter(false)} show={showHHReporter} venue={venue}/>
                <Container fluid={true} className={'venue-controls'}>
                    <Row className={'align-items-center top-row'}>
                        <Col xs={6} sm={'4'}>
                            <h5>{venue.name} {venue.venueTypes && <Badge color={'primary'}>{venue.venueTypes.join("/")}</Badge>}</h5>
                        </Col>
                        {
                            venue.venueTypes && !venue.venueTypes.includes("STORE") && <Col xs={6} sm={{offset: 4, size: 4}}>
                                {getHappyHourTime()}
                            </Col>
                        }
                    </Row>
                    <div className={'sticky-top'}>
                        <Row className={'justify-content-center top-row'} style={{backgroundColor: "white", marginBottom: '0', paddingTop: '5px'}}>
                            <Col xs={6} sm={6}>
                                <Beer4YourBuckBtn customStyle={BtnType.SECONDARY_CLEAR} onClick={() => setVenue(null)}>Change Venue</Beer4YourBuckBtn>
                            </Col>
                            <Col xs={{size: 6}} sm={{offset: 2, size: 4}}>
                                <Beer4YourBuckBtn onClick={onAddBeerClicked} customStyle={BtnType.PRIMARY_CLEAR}><MdAdd/> Add Beer</Beer4YourBuckBtn>
                            </Col>
                        </Row>
                        <Row style={{borderBottom: '1px solid lightgray', backgroundColor: "white", marginBottom: '0px', paddingTop: '5px', paddingBottom: '5px'}} className={'justify-content-center top-row'}>
                            <Col sm={4}>
                                <Input onChange={(e) => setSearchTerm(e.target.value)} placeholder={'Search Beer'}><IoMdSearch/></Input>
                            </Col>
                        </Row>
                    </div>
                    <Row className={'beers-list'}>
                        {
                            isLoading && <div style={{margin: '0 auto'}}><LoadingSpinner style={{maxHeight: '500px'}} message={`Loading beers for ${venue.name}`}/></div>
                        }
                        {
                            sortedBeers.length > 0 && !isLoading ? sortedBeers.map((beer, i) => <VenueBeerBrick
                                key={beer.id}
                                beer={beer}
                                upVoted={upVotedBeers.some(voted => voted.id === beer.id)}
                                downVoted={downVotedBeers.some(voted => voted.id === beer.id)}
                                userAdded={userAddedBeers.some(added => added.id === beer.id)}
                                place={i + 1}
                                onEditClick={handleBeerEdit}
                            />).filter(item => item.props.beer.name.includes(searchTerm)) : !isLoading ? (
                                <p>Looks like you're the first user here! Add beer to start comparing for this venue.</p>
                            ) : null
                        }
                    </Row>
                </Container>
                {showAddModal &&
                    <BeerAddModal
                        modalType={ModalType.ADD}
                        show={showAddModal}
                        onConfirm={onBeerAdded}
                        onClose={() => setShowAddModal(false)}
                        showCount={venue.venueTypes.includes("STORE") || venue.venueTypes.includes("BREWERY")}
                        showHappyHour={venue.venueTypes.includes("BREWERY") || venue.venueTypes.includes("RESTAURANT") || venue.venueTypes.includes("BAR")}
                    />
                }
                {showRegisterModal && <RegistrationModal
                    message={'With a Beer 4 Your Buck account, you can add different beers to a venue to compare ' +
                    'against other\'s that are there. Adding a beer to a venue helps other users find the best deals near them!'}
                    show={showRegisterModal}
                    onClose={() => setShowRegisterModal(false)}
                />}
                {isHappyHour && <div data-testid={'confetti'}><ReactConfetti style={{zIndex: 9999}} recycle={false}/></div>}
                {editBeer && <BeerAddModal
                    modalType={ModalType.EDIT}
                    show={editBeer !== null}
                    onConfirm={onBeerEditConfirm}
                    initialBeer={editBeer}
                    onClose={() => setEditBeer(null)}
                    showCount={venue.venueTypes.includes("STORE") || venue.venueTypes.includes("BREWERY")}
                    showHappyHour={venue.venueTypes.includes("BREWERY") || venue.venueTypes.includes("RESTAURANT") || venue.venueTypes.includes("BAR")}
                />}
            </div>
        )
    } else {
        return (
            <div className={noVenuesFound ? 'no-venue' : ''}>
                <VenueLocationSelectorModal onNoVenuesFound={() => setNoVenuesFound(true)}/>
                {noVenuesFound === undefined && <LoadingSpinner message={'Searching for possible venues near you...'}/>}
                {noVenuesFound && <p>Looks like you're not near any venues we know about. Please go to a venue that serves beer and try again!</p>}
            </div>
        )
    }
}