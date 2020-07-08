import React from "react";
import DropdownSection from "../dropdown-section/DropdownSection";

interface Props {
    children: any;
    title: string;
    values: string[] | number[];
}

export default function SelectDropdownSection(props: Props) {

    return (
        <DropdownSection title={props.title}>

        </DropdownSection>
    )
}


