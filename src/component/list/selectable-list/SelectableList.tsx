import React from "react";
import Beer from "../../../model/Beer";
import {ListGroup, Table} from "reactstrap";
import SelectableListItem from "./SelectableListItem";
import './selectable-list.css'

export interface SelectableListProps {
    beers: Beer[];
    getSelected: (beer: Beer) => void;
    hide: boolean
}

export default function SelectableList(props: SelectableListProps) {

    const onBeerSelect = (beer: Beer) => {
        props.getSelected(beer);
    };

    const getItems = () => {
        const list: Array<JSX.Element> = [];
        var i = 1;
        for (const beer of props.beers) {
            list.push(<SelectableListItem beer={beer} onSelect={onBeerSelect} key={i}/>);
            i++;
        }
        return list;
    };

    return (
        <Table hidden={props.hide} className={'selectable-list'}>
            <tbody>
                {
                    getItems()
                }
            </tbody>
        </Table>
    )
}