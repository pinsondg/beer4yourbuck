import React, {CSSProperties, ReactNode, RefObject, useEffect, useState} from "react";
import classNames from "classnames";
import {Button} from "reactstrap";

interface Props {
    scrollRef: RefObject<HTMLDivElement>;
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
}

export default function ScrollToTopButton(props: Props) {
    const [hidden, setHidden] = useState<boolean>(true);

    const classes = classNames(props.className ? props.className : 'scroll-to-top-button');


    useEffect(() => {
        const handleScroll = (event: Event) => {
            // @ts-ignore
            if (event.target!.scrollTop > 70) {
                setHidden(false);
            } else {
                setHidden(true);
            }
        };
        if (props.scrollRef.current) {
            props.scrollRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (props.scrollRef.current) {
                props.scrollRef.current.removeEventListener('scroll', handleScroll);
            }
        }
    }, [props.scrollRef]);

    const onClick = () => {
        if (props.scrollRef.current) {
            props.scrollRef.current.scrollTo({
                behavior: "smooth",
                top: 0
            });
        }
    };

    return (
        <Button style={props.style} hidden={hidden} className={classes} onClick={onClick} color={'primary'}>
            {props.children}
        </Button>
    )
}