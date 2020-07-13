import React, {CSSProperties, ReactNode, useEffect, useState} from "react";
import DropdownSection from "../dropdown-section/DropdownSection";
import CustomCheckbox from "../../misc/checkbox/CustomCheckbox";
import ChecklistRow from "../../input/checklist-row/ChecklistRow";
import './select-dropdown-section.scss'

interface Props {
    title: string;
    items: SelectionItem[];
    onAllSelected: (selected: boolean) => void;
    onOneSelected: (value: string, selected: boolean) => void;
    style?: CSSProperties;
}

export interface SelectionItem {
    value: string;
    selected: boolean;
}

export default function SelectDropdownSection(props: Props) {
    const [topSelected, setTopSelected] = useState<boolean>(false);

    /**
     * Determines if top box should be selected.
     */
    useEffect(() => {
        setTopSelected(!props.items.some(item => !item.selected));
    }, [props.items]);

    const getRows = (): ReactNode[] => {
        return props.items.map(item => {
            return  (
                <ChecklistRow
                    title={item.value}
                    selected={item.selected}
                    onChange={(selected) => props.onOneSelected(`${props.title} - ${item.value}`, selected)}
                />
            )
        })
    };

    return (
        <div style={props.style} className={'select-dropdown-section-holder'}>
            <DropdownSection className={'select-dropdown-section-dropdown'} title={props.title}>
                {getRows()}
            </DropdownSection>
            <div className={'select-dropdown-section-checkbox'}>
                <CustomCheckbox selected={topSelected} onChange={props.onAllSelected} size={30}/>
            </div>
        </div>
    )
}