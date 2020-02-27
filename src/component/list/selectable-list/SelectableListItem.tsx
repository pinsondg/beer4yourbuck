import React from "react";
import {Col, ListGroupItem, Row} from "reactstrap";
import Beer from "../../../model/Beer";
import {on} from "cluster";
import './selectable-list.css'

export interface SelectableListItemProps {
    beer: Beer;
    onSelect: (beer: Beer) => void
    key: number
}

export default function SelectableListItem(props: SelectableListItemProps) {

    const onSelect = (e: React.MouseEvent<HTMLTableRowElement>) => {
        props.onSelect(props.beer);
    };

    return (
        <tr className={'selectable-item'} onClick={onSelect}>
            <td>{props.beer.nameDisplay}</td>
            <td>{props.beer.abv + "% APV"}</td>
        </tr>
    )
}