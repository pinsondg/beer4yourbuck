import React, {ReactNode, useEffect, useState} from "react";
import './popover-menu.css'
import classNames from "classnames";
import {MdClose} from "react-icons/all";

interface Props {
    isOpen: boolean;
    onClose?: () => void;
    titleText: string;
    popoverDirection: PopoverDirection;
    bodyContent: ReactNode;
}

export enum PopoverDirection {
    LEFT, RIGHT
}

export default function PopoverMenu(props: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

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
        <div className={popoverClasses}>
            <div className={popoverHeaderClasses}>
                <h4>{props.titleText}</h4>
                <MdClose style={{color: 'red'}} size={30} onClick={handleClose}/>
            </div>
            <div className={'popover-menu-content'}>
                {props.bodyContent}
            </div>
        </div>
    )
}