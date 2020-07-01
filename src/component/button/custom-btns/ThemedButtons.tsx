import styled from "styled-components";

export enum BtnType {
    PRIMARY, SECONDARY, DANGER, PRIMARY_CLEAR, SECONDARY_CLEAR
}

interface Props {
    customStyle: BtnType;
}

interface ColorScheme {
    backgroundColor: string;
    borderColor: string;
    hoverColor: string
    textColor: string;
    activeColor: string;
    activeTextColor?: string
}

function getColor(type: BtnType): ColorScheme {
    switch (type) {
        case BtnType.DANGER:
            return {
                textColor: 'white',
                activeColor: 'darkred',
                backgroundColor: 'red',
                borderColor: 'red',
                hoverColor: ''
            };
        case BtnType.PRIMARY:
            return {
                backgroundColor: '#f6c101',
                borderColor: '#f6c101',
                activeColor: '#A87401',
                hoverColor: '#CF9A01',
                textColor: 'black',
                activeTextColor: 'white'
            };
        case BtnType.SECONDARY:
            return {
                backgroundColor: '#33658A',
                borderColor: '#33658A',
                textColor: 'white',
                activeColor: '#1F3F63',
                hoverColor: '#295276'
            };
        case BtnType.PRIMARY_CLEAR:
            return {
                backgroundColor: 'transparent',
                borderColor: '#f6c101',
                textColor: '#f6c101',
                activeColor: '#CF9A01',
                hoverColor: '#f6c101',
                activeTextColor: 'black'
            };
        case BtnType.SECONDARY_CLEAR:
            return {
                backgroundColor: 'transparent',
                borderColor: '#33658A',
                textColor: '#33658A',
                activeColor: '#295276',
                hoverColor: '#33658A',
                activeTextColor: 'white'
            }
    }
}

export const Beer4YourBuckBtn = styled.button<Props>`
    background-color: ${props => getColor(props.customStyle).backgroundColor};
    border-color: ${props => getColor(props.customStyle).borderColor};
    color: ${props => getColor(props.customStyle).textColor};
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    display: inline-block;
    font-weight: 400;
    box-shadow: ${props => props.customStyle !== BtnType.PRIMARY_CLEAR && props.customStyle !== BtnType.SECONDARY_CLEAR ? '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' : 'none'};
    text-align: center;
    vertical-align: middle;
    -webkit-user-select: none;
    user-select: none;
    border: 1px solid ${props => getColor(props.customStyle).borderColor};
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    outline:none !important;
    :hover {
        background-color: ${props => getColor(props.customStyle).hoverColor};
        border-color: ${props => getColor(props.customStyle).hoverColor};
        color: ${props => getColor(props.customStyle).activeTextColor ? getColor(props.customStyle).activeTextColor : getColor(props.customStyle).textColor};
    }
    :active:focus {
        box-shadow: none!important;
        outline:none !important;
        background-color: ${props => getColor(props.customStyle).activeColor};
        border-color: ${props => getColor(props.customStyle).activeColor};
    }
`;