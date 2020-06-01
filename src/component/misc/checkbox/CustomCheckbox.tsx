import React, {useEffect, useState} from "react";
import {MdCheck} from "react-icons/md";
import './custom-checkbox.css'

interface Props {
    size?: number
    onChange: (isSelected: boolean) => void;
    selected?: boolean;
}

export default function CustomCheckbox(props: Props) {
    const [isSelected, setIsSelected] = useState<boolean>(false);

    useEffect(() => {
        setIsSelected(props.selected ? props.selected : false);
    }, [props, props.selected]);

    return (
        <div onClick={() => {setIsSelected(!isSelected);props.onChange(!isSelected)}} style={{width: props.size ? props.size + 'px' : 'auto', height: props.size ? props.size + 'px' : 'auto', border: 'solid 1px darkgray', borderRadius: '0.25rem'}}>
            <div style={{margin: '0 auto', width: '100%', height: '100%', color: '#f6c101', display: isSelected ? "flex" : "none", flexDirection: "column", alignItems: "center"}}>
                <MdCheck stroke-width={1} className={'check-mark'} size={props.size ? props.size - 2 : 10}/>
            </div>
        </div>
    )
}