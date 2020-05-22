import React, {useState} from "react";
import {MdCheck} from "react-icons/md";
import './custom-checkbox.css'

interface Props {
    size?: number
    onChange: (isSelected: boolean) => void;
}

export default function CustomCheckbox(props: Props) {
    const [isSelected, setIsSelected] = useState<boolean>(false);

    return (
        <div onClick={() => {setIsSelected(!isSelected);props.onChange(!isSelected)}} style={{width: props.size ? props.size + 'px' : 'auto', height: props.size ? props.size + 'px' : 'auto', border: 'solid 1px darkgray', borderRadius: '0.25rem'}}>
            <div style={{margin: '0 auto', width: '100%', height: '100%', color: '#f6c101', display: "flex", flexDirection: "column", alignItems: "center"}} hidden={!isSelected}>
                <MdCheck stroke-width={1} className={'check-mark'} size={props.size ? props.size - 2 : 10}/>
            </div>
        </div>
    )
}