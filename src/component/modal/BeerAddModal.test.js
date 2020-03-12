import {fireEvent, render} from '@testing-library/react'
import BeerAddModal from "./BeerAddModal";
import React from "react";

it('calculation item should calculate score on input change', () => {
    const { getByPlaceholderText, getByText } = render(<BeerAddModal showScore={true}/>);
    const volumeInput = getByPlaceholderText('Volume');
    const abvInput = getByPlaceholderText('% APV');
    const beerInput = getByPlaceholderText('Beer Name');
    const costInput = getByPlaceholderText('Cost');
    fireEvent.change(beerInput, {target: {value: 'Bud Light'}});
    fireEvent.change(abvInput, {target: {value: '5'}});
    fireEvent.change(costInput, {target: {value: '6'}});
    fireEvent.change(volumeInput, {target: {value: '12'}});
    getByText('Ottaway Score: 0.78');
});