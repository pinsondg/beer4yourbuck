import React, {CSSProperties, ReactNode, useState} from "react";
import {Collapse} from "reactstrap";
import {IoIosArrowDown} from "react-icons/io";
import './dropdown-section.css'
import classNames from "classnames";

interface Props {
    children: ReactNode;
    title: string;
    className?: string;
    style?: CSSProperties;
}

export default function DropdownSection(props: Props) {
    const [isOpen, setIsOpen]  =  useState<boolean>(false);

    const arrowClass = classNames('dropdown-toggle-1', {
        'down': !isOpen,
        'up': isOpen
    });

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    const baseClassNames = classNames('dropdown-container', props.className);

    return (
        <div style={props.style} className={baseClassNames}>
            <div className={'title-header'} onClick={toggle}>
                <h5>{props.title}</h5>
                <div className={arrowClass}>
                    <IoIosArrowDown size={20}/>
                </div>
            </div>
            <Collapse isOpen={isOpen}>
                <div className={'dropdown-content-container'}>
                    {props.children}
                </div>
            </Collapse>
        </div>
    )
}