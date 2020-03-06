import React from "react";
import './selectable-list.css'

export interface SelectableListItemProps {
    component: JSX.Element;
    onSelect: (index: number) => void
    index: number;
}

export default function SelectableListItem(props: SelectableListItemProps) {

    const onSelect = (e: React.MouseEvent<HTMLTableRowElement>) => {
        props.onSelect(props.index);
    };

    return (
        <div className={'selectable-item'} onClick={onSelect}>
            {props.component}
        </div>
    )
}