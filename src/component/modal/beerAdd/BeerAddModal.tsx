import React, {useEffect, useState} from "react";
import BeerSearcher from "../../input/beer-searcher/BeerSearcher";
import {Button, Col, Form, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import ABVInput from "../../input/apv-input/ABVInput";
import {Beer} from "../../../model/Beer";
import CostInput from "../../input/cost-input/CostInput";
import VolumeInput from "../../input/volume-input/VolumeInput";
import {OttawayCalculator} from "../../../controller/OttawayCalculator";
import PoweredByUntapped from "../../misc/untapped/PoweredByUntapped";
import './beer-add-modal.css'
import {CountInput} from "../../input/count-input/CountInput";
import CustomCheckbox from "../../misc/checkbox/CustomCheckbox";

interface BeerAddModalProps {
    initialBeer?: Beer
    errors?: InputErrors
    onScoreCalculated?: (score: number) => void;
    showScore?: boolean
    modalType: ModalType;
    onConfirm: (beer: Beer) => void;
    show?: boolean;
    onClose?: () => void;
    showCount?: boolean;
    showHappyHour?: boolean;
}

export enum ModalType {
    ADD, EDIT
}

export enum CalculationItemInput {
    BEER_NAME, APV, COST, VOLUME
}

interface InputErrors {
    beerError: boolean;
    apvError: boolean;
    volumeError: boolean;
    priceError: boolean;
}

export default function BeerAddModal(props: BeerAddModalProps) {
    const [selectedBeer, setSelectedBeer] = useState<Beer | null>(null);
    const [apvInput, setApvInput] = useState<number | null>(null);
    const [cost, setCost] = useState<number | null>(null);
    const [volume, setVolume] = useState<number | null>(null);
    const [count, setCount] = useState<number>(1);
    const [inputErrors] = useState<InputErrors>({
        beerError: false,
        apvError: false,
        volumeError: false,
        priceError: false
    });
    const [score, setScore] = useState<number | null>(null);
    const [focusedInput, setFocusedInput] = useState<CalculationItemInput>(CalculationItemInput.BEER_NAME);
    const {onScoreCalculated} = props;
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [beerName, setBeerName] = useState<string>('');
    const [isHappyHourDeal, setIsHappyHourDeal] = useState(false);

    useEffect(() => {
        let ottawayScore = -1;
        if (apvInput && cost && volume) {
            ottawayScore = OttawayCalculator.calculate(apvInput, cost, volume, count);
        }
        if (ottawayScore > -1 && onScoreCalculated && ottawayScore !== score) {
            onScoreCalculated(ottawayScore);
        }
        setScore(ottawayScore);
    }, [onScoreCalculated, score, cost, volume, apvInput, count]);

    useEffect(() => {
        const beer = props.initialBeer;
        if (beer) {
            if (beer.label) {
                setSelectedBeer(beer);
            }
            setBeerName(beer.name ? beer.name : '');
            setApvInput(beer.abv ? +beer.abv : null);
            setVolume(beer.volume ? beer.volume : null);
            setCost(beer.price ? beer.price : null);
        }
    }, [props]);

    useEffect(() => {
        setIsOpen(props.show ? props.show : false)
    }, [props]);

    const onBeerSelected = (selectedBeer: Beer) => {
        setSelectedBeer(selectedBeer);
        const {abv} = selectedBeer;
        if (abv) {
            const num: number = +abv;
            setApvInput(num)
        }
    };

    const getCost = (cost: number) => {
        setCost(cost)
    };

    const getVolume = (volume: number) => {
        setVolume(volume);
    };

    const onBeerSwitch = () => {
        setApvInput(null);
        setSelectedBeer(null);
        if (props.modalType === ModalType.ADD) {
            setCost(null);
            setVolume(null);
        }
    };

    const toggle = () => {
        if (props.onClose) {
            props.onClose();
        }
        setIsOpen(!isOpen);
    };

    const onAdd = () => {
        if (apvInput && cost && volume && score) {
            if (selectedBeer) {
                selectedBeer.price = cost;
                selectedBeer.volume = volume;
                selectedBeer.count = count;
                selectedBeer.isHappyHourDeal = isHappyHourDeal;
                props.onConfirm(selectedBeer);
            } else {
                const beer: Beer = new Beer.Builder()
                    .withName(beerName)
                    .withAbv(apvInput.toString())
                    .withPrice(cost)
                    .withVolume(volume)
                    .withCount(count)
                    .withIsHappyHour(isHappyHourDeal)
                    .build();
                props.onConfirm(beer);
            }
        } else {
            //TODO: Display errors
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>{props.modalType === ModalType.ADD ? 'Add' : 'Edit'} Beer</ModalHeader>
            <ModalBody>
                <Form autoComplete={'off'}>
                    <BeerSearcher
                        getSelected={onBeerSelected}
                        onBeerSwitch={onBeerSwitch}
                        focused={focusedInput === CalculationItemInput.BEER_NAME}
                        onFocus={() => setFocusedInput(CalculationItemInput.BEER_NAME)}
                        getName={name => setBeerName(name)}
                        text={beerName}
                        selectedBeer={selectedBeer ? selectedBeer : undefined}
                    />
                    <ABVInput
                        text={apvInput ? apvInput.toString() : ''}
                        locked={selectedBeer !== null}
                        getVal={val => setApvInput(+val)}
                    />
                    <CostInput
                        getCost={getCost}
                        text={cost ? cost.toString() : ''}
                        error={inputErrors.beerError}
                    />
                    <VolumeInput
                        getVolume={getVolume}
                        text={volume ? volume.toString() : ''}
                        error={inputErrors.volumeError}
                    />
                    {
                        props.showHappyHour && <InputGroup style={{marginBottom: '10px'}} className={'align-items-center'} row>
                            <Label style={{marginBottom: 0}}>Happy Hour Deal</Label>
                            <Col>
                                <CustomCheckbox size={30} selected={isHappyHourDeal} onChange={(val) => setIsHappyHourDeal(val)}/>
                            </Col>
                        </InputGroup>
                    }
                    {props.showCount && <CountInput
                        onValueChange={(val) => setCount(+val)}
                    />}
                    {
                        props.showScore && score && score > -1 &&
                            <p>{"Ottaway Score: " + score.toFixed(2)}</p>
                    }
                </Form>
                <PoweredByUntapped className={'untapped'} text={'Beer Search is '}/>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onAdd} color={'primary'} disabled={score === -1}>{props.modalType === ModalType.ADD ? 'Add' : 'Update'}</Button>
            </ModalFooter>
        </Modal>
    )
}