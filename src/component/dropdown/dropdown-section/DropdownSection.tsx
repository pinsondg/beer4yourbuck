import React, {CSSProperties, ReactNode, useEffect, useState} from "react";
import {Collapse} from "reactstrap";
import {IoIosArrowDown} from "react-icons/io";
import './dropdown-section.css'
import classNames from "classnames";

interface Props {
    children: ReactNode;
    title: string;
    className?: string;
    style?: CSSProperties;
    isOpen?: boolean;
    onChange?: (isOpen: boolean) => void
}

export default function DropdownSection(props: Props) {
    const {onChange, title, isOpen}  = props;
    const [isOpenLocal, setIsOpenLocal]  =  useState<boolean>(false);

    useEffect(() => {
        if (isOpen !== undefined) {
            setIsOpenLocal(isOpen);
        }
    }, [isOpen]);

    const arrowClass = classNames('dropdown-toggle-1', {
        'down': !isOpenLocal,
        'up': isOpenLocal
    });

    const toggle = () => {
        setIsOpenLocal(!isOpenLocal);
        if (onChange) {
            onChange(!isOpenLocal);
        }
    };

    const baseClassNames = classNames('dropdown-container', props.className);

    return (
        <div style={props.style} className={baseClassNames}>
            <div className={'title-header'} onClick={toggle}>
                <h5>{title}</h5>
                <div className={arrowClass}>
                    <IoIosArrowDown size={20}/>
                </div>
            </div>
            <Collapse isOpen={isOpenLocal}>
                <div className={'dropdown-content-container'}>
                    {props.children}
                </div>
            </Collapse>
        </div>
    )
}