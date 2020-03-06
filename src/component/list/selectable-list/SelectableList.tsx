import React from "react";
import SelectableListItem from "./SelectableListItem";
import './selectable-list.css'
import classNames from "classnames";

export interface SelectableListProps {
    components: JSX.Element[];
    getSelected: (index: number) => void;
    hide: boolean;
    showShadow?: boolean;
}

let id = 0;

export default function SelectableList(props: SelectableListProps) {

    const classes = classNames('selectable-list-holder', {'shadow': props.showShadow});

    const onItemSelect = (index: number) => {
        props.getSelected(index);
    };

    return (
        <div className={classes} hidden={props.hide}>
            {
                props.components.map((component, index) => (
                    <SelectableListItem
                        key={id++}
                        component={component}
                        onSelect={onItemSelect}
                        index={index}/>
                ))
            }
        </div>
    )
}