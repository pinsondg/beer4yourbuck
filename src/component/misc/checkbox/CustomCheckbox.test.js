import CustomCheckbox from "./CustomCheckbox";
import React from "react";
import {render} from '@testing-library/react'

describe('Test Checkbox', () => {

    it('should be active when prop set', () => {
        const {get} = render(<CustomCheckbox onChange={() => {}} selected={true}/>)
    })
});