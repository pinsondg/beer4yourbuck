import React from "react";
import {Filter} from "../../../model/Filter";
import './active-filter-badge.scss'
import {MdClose} from "react-icons/all";

interface Props {
    filterId: number;
    filter: Filter;
    onRemove: (id: number) => void;
    canRemove: boolean;
}

export default function ActiveFilterBadge(props: Props) {

    return (
        <div className={'filter-badge'}>
            <div className={'filter-badge-content'}>
                <p>{props.filter.displayValue}</p>
                {
                    props.canRemove && <div onClick={() => props.onRemove(props.filterId)} className={'remove-button'}>
                        <MdClose size={15}/>
                    </div>
                }
            </div>
        </div>
    )
}