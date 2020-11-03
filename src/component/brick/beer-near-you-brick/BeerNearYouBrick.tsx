import React from "react";
import {Beer} from "../../../model/Beer";
import {BeerVenue} from "../../../model/BeerVenue";
import {Col, Container, Jumbotron, Row} from "reactstrap";
import '../brick.css'
import './beer-near-you-brick.css'

interface Props {
    beer: Beer;
    venue: BeerVenue;
}

export function BeerNearYouBrick(props: Props) {

    return (
        <Jumbotron className={'brick'}>
            <Container>
                <Row>
                    <Col sm={2}>

                    </Col>
                </Row>
            </Container>
        </Jumbotron>
    )
}