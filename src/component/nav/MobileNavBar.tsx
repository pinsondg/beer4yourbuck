import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "reactstrap";
import {MdCameraAlt, MdCompareArrows, MdMyLocation, MdNearMe} from "react-icons/all";
import './mobile-navbar.css'
import {useHistory, useLocation} from "react-router-dom";

export default function MobileNavBar() {
    const [active, setActive] = useState<string | null>(null);
    const history = useHistory();
    const location = useLocation();


    useEffect(() => {
        switch (location.pathname) {
            case '/near':
                setActive('near');
                break;
            case '/compare':
                setActive('compare');
                break;
            case '/upload':
                setActive('upload');
                break;
            case '/current-venue':
                setActive('venue');
                break;
            default:
                setActive(null);
                break;
        }
    }, [location.pathname]);

    return (
        <div style={{flex: '1 1 auto', backgroundColor: '#343a40'}}>
            <Container style={{margin: '0 auto', padding: '10px'}}>
                <Row className={'justify-content-center align-items-center'}>
                    <Col className={`mobile-nav-item ${active && active === 'near' ? ' active' : ''}`}>
                        <MdNearMe size={35} onClick={() => history.push('/near')}/>
                    </Col>
                    <Col className={`mobile-nav-item ${active && active === 'compare' ? ' active' : ''}`}>
                        <MdCompareArrows size={35} onClick={() => history.push('/compare')}/>
                    </Col>
                    <Col className={`mobile-nav-item ${active && active === 'upload' ? ' active' : ''}`}>
                        <MdCameraAlt size={35} onClick={() => history.push('/upload')}/>
                    </Col>
                    <Col className={`mobile-nav-item ${active && active === 'venue' ? ' active' : ''}`}>
                        <MdMyLocation size={35} onClick={() => history.push('/current-venue')}/>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}