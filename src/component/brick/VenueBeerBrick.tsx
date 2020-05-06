import React, {useContext, useEffect, useState} from "react";
import {Beer} from "../../model/Beer";
import {Badge, Col, Container, Jumbotron, Row, UncontrolledTooltip} from "reactstrap";
import CircularBeerLogo from "../image/CircularBeerLogo";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";
import {UserContext} from "../../context/UserContext";
import RegistrationModal from "../modal/RegistrationModal";
import {FaArrowAltCircleDown, FaArrowAltCircleUp} from "react-icons/fa";
import './venue-beer-brick.css'
import './brick.css'
import classNames from "classnames";

const api = Beer4YourBuckAPI.getInstance();

interface Props {
    upVoted?: boolean;
    downVoted?: boolean;
    userAdded?: boolean;
    beer: Beer;
    place: number;
}

export default function VenueBeerBrick(props: Props) {
    const [upVoted, setUpVoted] = useState<boolean>(false);
    const [downVoted, setDownVoted] = useState<boolean>(false);
    const [userAddedBeer, setUserAddedBeer] = useState<boolean>(false);
    const [showRegistrationModal, setShowRegistrationModal] = useState<boolean>(false);
    const [voteCount, setVoteCount] = useState<number | null>(null);
    const {user} = useContext(UserContext);

    const vote = (isUpvote: boolean) => {
        if (user) {
            if((!upVoted && isUpvote) || (!downVoted && !isUpvote)) {
                if (isUpvote) {
                    setDownVoted(false);
                } else {
                    setUpVoted(false);
                }
                api.voteOnBeer(props.beer, isUpvote).then(() => {
                    if (isUpvote) {
                        setUpVoted(true);
                    } else {
                        setDownVoted(true);
                    }
                }).catch(err => {
                    if (err.response.status === 401) {
                        setShowRegistrationModal(true);
                    }
                });
            }
        } else {
            setShowRegistrationModal(true);
        }
    };

    useEffect(() => {
        if (props.upVoted) {
            setUpVoted(props.upVoted);

        }
        if (props.downVoted) {
            setDownVoted(props.downVoted);
        }
        if (props.userAdded) {
            setUserAddedBeer(true);
        }
    }, [props]);

    useEffect(() => {
        api.getBeerVotedScore(props.beer).then(data => {
            console.log(data.data);
            console.log(voteCount);
            if (voteCount !== data.data) {
                setVoteCount(data.data);
            }
        }).catch(err => {
            setVoteCount(null);
        });
    });

    const upvoteClasses = classNames('vote-button', {
        'upvoted': upVoted
    });

    const downvoteClasses = classNames('vote-button', {
        'downvoted': downVoted
    });

    const getPlace = (): string => {
        let suffix = 'th';
        switch (props.place) {
            case 1:
                suffix = 'st';
                break;
            case 2:
                suffix = 'nd';
                break;
            case 3:
                suffix = 'rd';
                break;
        }
        return `${props.place}${suffix}`;
    };

    return (
        <Jumbotron className={'brick'} style={{flexDirection: 'row', justifyContent: 'center', width: '60%'}}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', flex: '1 1 500px'}}>
                <div className={'vote-buttons-group'}>
                    <h4>
                        {getPlace()}
                    </h4>
                    <div className={upvoteClasses} onClick={() => vote(true)}>
                        <FaArrowAltCircleUp size={35} id={'upvote-button'}/>
                        <UncontrolledTooltip target={'upvote-button'}>This beer is present at this venue and it's information is accurate.</UncontrolledTooltip>
                    </div>
                    <div>
                        <h6>{voteCount !== null ? voteCount > 0 ? '+' + voteCount.toString() : voteCount < 0 ? voteCount.toString() : voteCount.toString() : 'N/A'}</h6>
                    </div>
                    <div className={downvoteClasses} onClick={() => vote(false)}>
                        <FaArrowAltCircleDown size={35} id={'downvote-button'}/>
                        <UncontrolledTooltip target={'downvote-button'}>This beer is not present at this venue or it's information is inaccurate.</UncontrolledTooltip>
                    </div>
                </div>
                <Container style={{height: '100%'}}>
                    {userAddedBeer &&<Row>
                        <Col>
                            <div style={{marginBottom: '5px'}}>
                                <Badge color={'primary'} pill>You Added</Badge>
                            </div>
                        </Col>
                    </Row>}
                    <Row className={'justify-content-center align-items-center'} style={userAddedBeer ? {} : {height: '100%'}}>
                        <Col sm={8} md={'auto'} style={{display: 'flex', justifyContent: 'center'}}>
                            <div className={'logo-holder venue'}>
                                <CircularBeerLogo src={props.beer.label}/>
                            </div>
                        </Col>
                        <Col sm={4} md={'auto'}>
                            <Row>
                                <Col>
                                    <h5>{props.beer.name}</h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <h6>{`${props.beer.abv} %ABV - ${props.beer.volume} fl. oz.`}</h6>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
                <div className={'vote-buttons-group'}>
                    <h5>{"$" + (props.beer && props.beer.price ? props.beer.price.toFixed(2) : 'N/A')}</h5>
                </div>
                {showRegistrationModal && <RegistrationModal
                    show={showRegistrationModal}
                    onClose={() => setShowRegistrationModal(false)}
                    message={'With a Beer 4 Your Buck account, you can upvote beers that are at your current venue and downvote beers that aren\'t. This' +
                    ' helps us accurately show users which venues have the best Beer 4 Your Buck!'}
                />}
            </div>
        </Jumbotron>
    )
}