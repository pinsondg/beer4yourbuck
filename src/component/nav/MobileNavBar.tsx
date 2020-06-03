import React, {ReactNode, useEffect, useState} from "react";
import {Col, Container, Row} from "reactstrap";
import {MdCameraAlt, MdCompareArrows, MdMyLocation, MdNearMe} from "react-icons/md";
import './mobile-navbar.css'
import {useHistory, useLocation} from "react-router-dom";
import {CircleClick} from "../misc/circle-click/CircleClick";
import Color from 'color'

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
                    <Col>
                        <MenuCircleClick onClick={() => history.push('/near')} isCurrent={!!active && active === 'near'}>
                            <MdNearMe size={27}/>
                        </MenuCircleClick>
                    </Col>
                    <Col>
                        <MenuCircleClick onClick={() => history.push('/compare')}  isCurrent={!!active && active === 'compare'}>
                            <MdCompareArrows size={27}/>
                        </MenuCircleClick>
                    </Col>
                    <Col>
                        <MenuCircleClick onClick={() => history.push('/upload')} isCurrent={!!active && active === 'upload'}>
                            <MdCameraAlt size={27}/>
                        </MenuCircleClick>
                    </Col>
                    <Col>
                        <MenuCircleClick onClick={() => history.push('/current-venue')} isCurrent={!!active && active === 'venue'}>
                            <MdMyLocation size={27}/>
                        </MenuCircleClick>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

interface MenuCircleClickProps {
    onClick: () => void;
    isCurrent: boolean;
    children?: ReactNode;
}

function MenuCircleClick(props: MenuCircleClickProps) {
    return (
        <CircleClick size={'30px'}
                     nonActiveColor={new Color('rgba(255, 255, 255, 0.1)')}
                     activeColor={new Color('rgb(246, 193, 1)')}
                     isCurrent={props.isCurrent}
                     onClick={props.onClick}
                     center={true}
        >
            {props.children}
        </CircleClick>
    )
}