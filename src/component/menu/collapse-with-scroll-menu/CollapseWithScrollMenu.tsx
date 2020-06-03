import React, {MutableRefObject, ReactNode, useEffect, useRef, useState} from "react";

interface Props {
    scrollRef?: MutableRefObject<HTMLDivElement> | null;
    children?: ReactNode;
}

export default function CollapseWithScrollMenu(props: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [hidden, setHidden] = useState<boolean>(false);
    const [scrollY, setScrollY] = useState<number>(0);
    const [top, setTop] = useState<number>(0);

    useEffect(() => {

    });

    const handleScroll = (e: Event) => {
        if (props.scrollRef) {
            const currScroll = props.scrollRef.current.scrollTop;
            if (currScroll > scrollY && wrapperRef && wrapperRef.current) {
                wrapperRef.current.style.top = `${top - 1}px`;
                setTop(top - 1);
                console.log("DOWN");
            } else if (currScroll < scrollY && wrapperRef && wrapperRef.current) {
                console.log("UP");
            }
            setScrollY(currScroll);
        }
    };

    useEffect(() => {
        if (props.scrollRef) {
            props.scrollRef.current.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (props.scrollRef) {
                props.scrollRef.current.removeEventListener('scroll', handleScroll);
            }
        }
    });

    return (
        <div style={{top: top}} ref={wrapperRef}>
            {props.children}
        </div>
    )
}