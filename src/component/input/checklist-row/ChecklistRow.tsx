import React, {CSSProperties, ReactText, useEffect, useState} from "react";
import CustomCheckbox from "../../misc/checkbox/CustomCheckbox";
import './checklist-row.scss';
import classNames from "classnames";

interface Props {
    title: ReactText;
    selected: boolean;
    checkboxSize?: number
    onChange: (selected: boolean) => void
    classNames?: string;
    style?: CSSProperties;
}

export default function ChecklistRow(props: Props) {
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        setIsSelected(props.selected);
    }, [props]);

    const baseDivClasses = classNames('checklist-row', props.classNames);

    return (
        <div style={{display: "flex", flexDirection: 'column'}}>
            <div style={props.style} className={baseDivClasses}>
                <div className={'title-holder'}>
                    <h5>{props.title}</h5>
                </div>
                <div className={'checkbox-holder'}>
                    <CustomCheckbox selected={isSelected} onChange={props.onChange} size={props.checkboxSize ? props.checkboxSize : 30}/>
                </div>
            </div>
        </div>
    )
}