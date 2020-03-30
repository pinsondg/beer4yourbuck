import React, {useEffect, useState} from "react";
import {Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, Label} from "reactstrap";
import classNames from "classnames";
import './volume-input.css'

interface VolumeInputProps {
    getVolume?: (volume: number) => void;
    text?: string;
    error?: boolean;
}

export default function VolumeInput(props: VolumeInputProps) {
    const [volume, setVolume] = useState<string>('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        setVolume(val);
    };

    const toggle = () => setDropdownOpen(prevState => !prevState);

    const classes = classNames('volume-input custom-input', {'error': props.error});

    useEffect(() => {
        if (props.text) {
            setVolume(props.text);
        } else {
            setVolume('12')
        }
    }, [props.text]);

    useEffect(() => {
        if (props.getVolume && volume !== '') {
            props.getVolume(+volume)
        }
    }, [props, volume]);

    const onDropdownItemSelected = (e: any) => {
        setVolume(e.target.innerText.substring(0, 2));
    };

    return (
        <FormGroup row>
            <Label for={'volume'} sm={'2'}>Volume (fl oz)</Label>
            <Col sm={'10'}>
                <div className={'input-holder'}>
                    <Input
                        id={'volume'}
                        className={classes}
                        value={volume}
                        step={'0.01'}
                        type={'number'}
                        name={'volume'}
                        onChange={handleChange}
                    />
                    <Dropdown toggle={toggle} isOpen={dropdownOpen} className={'volume-dropdown'}>
                        <DropdownToggle caret/>
                        <DropdownMenu>
                            <DropdownItem header>Choose Size</DropdownItem>
                            <DropdownItem onClick={onDropdownItemSelected}>8 fl oz</DropdownItem>
                            <DropdownItem onClick={onDropdownItemSelected}>12 fl oz</DropdownItem>
                            <DropdownItem onClick={onDropdownItemSelected}>14 fl oz</DropdownItem>
                            <DropdownItem onClick={onDropdownItemSelected}>16 fl oz</DropdownItem>
                            <DropdownItem onClick={onDropdownItemSelected}>20 fl oz</DropdownItem>
                            <DropdownItem onClick={onDropdownItemSelected}>24 fl oz</DropdownItem>
                            <DropdownItem onClick={onDropdownItemSelected}>40 fl oz</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </Col>
        </FormGroup>
    )
}