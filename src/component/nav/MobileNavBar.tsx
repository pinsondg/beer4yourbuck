import React, {ReactNode, useContext, useEffect, useState} from "react";
import {Col, Container, Row} from "reactstrap";
import {MdCameraAlt, MdCompareArrows, MdMyLocation, MdNearMe} from "react-icons/md";
import './mobile-navbar.css'
import {useHistory, useLocation} from "react-router-dom";
import {CircleClick} from "../misc/circle-click/CircleClick";
import Color from 'color'
import {CurrentContentRef} from "../../context/CurrentContentRef";

export default function MobileNavBar() {
    const {contentRef} = useContext(CurrentContentRef);
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
                setActive('current-venue');
                break;
            default:
                setActive(null);
                break;
        }
    }, [location.pathname]);

    const onCLick = (page: string) => {
        // console.log(JSON.stringify(contentRef));
        if (isCurrent(page) && contentRef && contentRef.current) {
            contentRef.current.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        } else {
            history.push('/' + page);
        }
    };

    const isCurrent = (page: string): boolean => {
        return !!active && active === page;
    };

    return (
        <div className={'mobile-nav-bar'}>
            <Container style={{margin: '0 auto', padding: '10px'}}>
                <Row className={'justify-content-center align-items-center'}>
                    <Col>
                        <MenuCircleClick onClick={() => onCLick('near')} isCurrent={isCurrent('near')}>
                            <MdNearMe size={27}/>
                        </MenuCircleClick>
                    </Col>
                    <Col>
                        <MenuCircleClick onClick={() => onCLick('compare')}  isCurrent={isCurrent('compare')}>
                            <MdCompareArrows size={27}/>
                        </MenuCircleClick>
                    </Col>
                    <Col>
                        <MenuCircleClick onClick={() => onCLick('upload')} isCurrent={isCurrent('upload')}>
                            <MdCameraAlt size={27}/>
                        </MenuCircleClick>
                    </Col>
                    <Col>
                        <MenuCircleClick onClick={() => onCLick('current-venue')} isCurrent={isCurrent('current-venue')}>
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