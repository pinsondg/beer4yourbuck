import React, {ReactNode, useEffect, useRef, useState} from "react";
import './popover-menu.css'
import classNames from "classnames";
import {MdClose} from "react-icons/md";
import Color from 'color'
import {CircleClick} from "../../misc/circle-click/CircleClick";

interface Props {
    isOpen: boolean;
    onClose?: () => void;
    titleText: string;
    popoverDirection: PopoverDirection;
    children?: ReactNode;
}

export enum PopoverDirection {
    LEFT, RIGHT
}

export default function PopoverMenu(props: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (e: MouseEvent): any => {
        if (e.target instanceof HTMLElement
            && wrapperRef
            && wrapperRef.current
            && !wrapperRef.current.contains(e.target)) {
            handleClose();
        }
    };

    useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    const popoverClasses = classNames('popover-menu', {
        'left': props.popoverDirection === PopoverDirection.LEFT,
        'right' : props.popoverDirection === PopoverDirection.RIGHT,
        'closed': !isOpen
    });

    const popoverHeaderClasses = classNames('popover-menu-header', {
        'left': props.popoverDirection === PopoverDirection.LEFT,
        'right' : props.popoverDirection === PopoverDirection.RIGHT
    });

    useEffect(() => {
        setIsOpen(props.isOpen)
    }, [props.isOpen]);

    const handleClose = () => {
        if (props.onClose) {
            props.onClose();
        }
        setIsOpen(false);
    };

    return (
        <div>
            <div style={{display: isOpen ? 'block': 'none', zIndex: 1040, position: "fixed", top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000', opacity: '0.5', transition: 'opacity .1s linear'}}/>
            <div className={popoverClasses} ref={wrapperRef}>
                <div className={popoverHeaderClasses}>
                    <h4>{props.titleText}</h4>
                    <CircleClick onClick={handleClose} activeColor={new Color('red')} nonActiveColor={new Color('red')} isCurrent={true} size={'35px'}>
                        <MdClose className={'popover-close-button'} size={30}/>
                    </CircleClick>
                </div>
                <div className={'popover-menu-content'}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}