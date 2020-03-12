import {fireEvent, render} from '@testing-library/react'
import BeerAddModal from "./BeerAddModal";
import React from "react";

it('calculation item should calculate score on input change', () => {
    const {getByText, getByLabelText } = render(<BeerAddModal showScore={true} onAdd={() => {}}/>);
    const volumeInput = getByLabelText('Volume (fl oz)');
    const abvInput = getByLabelText('ABV (%)');
    const beerInput = getByLabelText('Beer Name');
    const costInput = getByLabelText('Cost ($)');
    fireEvent.change(beerInput, {target: {value: 'Bud Light'}});
    fireEvent.change(abvInput, {target: {value: '5'}});
    fireEvent.change(costInput, {target: {value: '6'}});
    fireEvent.change(volumeInput, {target: {value: '12'}});
    getByText('Ottaway Score: 0.78');
});