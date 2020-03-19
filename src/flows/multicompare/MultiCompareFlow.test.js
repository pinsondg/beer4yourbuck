import {fireEvent, render} from '@testing-library/react'
import React from "react";
import {MultiCompareFlow} from "./MultiCompareFlow";

it('when add clicked modal should show', () => {
    const {getAllByRole, getByText} = render(<MultiCompareFlow showScore={true} onAdd={() => {}}/>);
    let addButton = getAllByRole('button');
    console.log(addButton[0]);
    fireEvent.click(addButton[0]);
    getByText('Add Beer');
});