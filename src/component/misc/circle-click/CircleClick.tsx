import React from "react";
import styled from "styled-components";
import Color from 'color'


interface Props {
    size?: number | string;
    nonActiveColor: Color;
    activeColor: Color;
    isCurrent: boolean;
    center?: boolean;
}

export const CircleClick = styled.div<Props>`
    transition: background-color 0.2s ease;
    ${props => props.center ? 'margin: 0 auto;' : ''}
    border-radius: 50%;
    width: ${props => props.size};
    height: ${props => props.size};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.isCurrent ? props.activeColor.hex() : props.nonActiveColor.toString()};
    :active {
        background-color: ${props => props.activeColor ? new Color(props.activeColor).alpha(0.6).toString() : 'rgba(255, 255, 255, 1)'}
    }
`;