import React, {useEffect, useState} from "react";
import {Beer} from "../../model/Beer";
import {Button, Col, Container, Jumbotron, Row} from "reactstrap";
import CircularBeerLogo from "../image/CircularBeerLogo";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";

const api = new Beer4YourBuckAPI();

interface Props {
    upVoted?: boolean;
    downVoted?: boolean;
    beer: Beer;
}

export default function VenueBeerBrick(props: Props) {
    const [upVoted, setUpVoted] = useState<boolean>(false);
    const [downVoted, setDownVoted] = useState<boolean>(false);

    const vote = (isUpvote: boolean) => {
        api.voteOnBeer(props.beer, isUpvote).then(() => {
            if (isUpvote) {
                setUpVoted(true);
            } else {
                setDownVoted(true);
            }
        });
    };

    useEffect(() => {
        if (props.upVoted) {
            setUpVoted(props.upVoted);

        }
        if (props.downVoted) {
            setDownVoted(props.downVoted);
        }
    }, [props]);

    return (
        <Jumbotron>
            <Container>
                <Row>
                    <Col xs={2}>
                        <Button color={upVoted ? 'success' : 'primary'} disabled={upVoted || downVoted} onClick={() => vote(true)}>Upvote</Button>
                        <Button color={downVoted ? 'danger' : 'primary'} disabled={upVoted || downVoted} onClick={() => vote(false)}>Downvote</Button>
                    </Col>
                    <Col >
                        <CircularBeerLogo src={props.beer.label}/>
                    </Col>
                    <Col>

                    </Col>
                    <Col>

                    </Col>
                </Row>
            </Container>
        </Jumbotron>
    )
}