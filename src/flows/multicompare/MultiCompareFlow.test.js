import {fireEvent, render} from '@testing-library/react'
import React from "react";
import {MultiCompareFlow} from "./MultiCompareFlow";

it('when add clicked modal should show', () => {
    const {getByText} = render(<MultiCompareFlow showScore={true} onAdd={() => {}}/>);
    let addButton = getByText('Add');
    fireEvent.click(addButton);
    getByText('Add Beer');
});