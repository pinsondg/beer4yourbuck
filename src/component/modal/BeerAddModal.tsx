import React, {useEffect, useState} from "react";
import BeerSearcher from "../input/beer-searcher/BeerSearcher";
import {Button, Form, Modal, ModalBody, ModalHeader} from "reactstrap";
import ABVInput from "../input/apv-input/ABVInput";
import {Beer} from "../../model/Beer";
import CostInput from "../input/cost-input/CostInput";
import VolumeInput from "../input/volume-input/VolumeInput";
import {OttawayCalculator} from "../../controller/OttawayCalculator";

interface BeerAddModalProps {
    errors?: InputErrors
    onScoreCalculated?: (score: number) => void;
    showScore?: boolean
    onAdd: (beer: Beer) => void;
    show?: boolean;
    onClose?: () => void;
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

    useEffect(() => {
        let ottawayScore = -1;
        if (apvInput && cost && volume) {
            ottawayScore = OttawayCalculator.calculate(apvInput, cost, volume);
        }
        console.log("Ottaway Score is: " + ottawayScore);
        if (ottawayScore > -1 && onScoreCalculated && ottawayScore !== score) {
            onScoreCalculated(ottawayScore);
        }
        setScore(ottawayScore);
    }, [onScoreCalculated, score, cost, volume, apvInput]);

    useEffect(() => {
        setIsOpen(props.show ? props.show : false)
    }, [props]);


    // const handleEnterPressed = (e: KeyboardEvent) => {
    //     if (e.key === 'Enter' && focusedInput !== CalculationItemInput.VOLUME) {
    //         e.preventDefault();
    //         setFocusedInput(focusedInput + 1);
    //     }
    // };
    //
    // useEffect(() => {
    //     // Bind the event listener
    //     document.addEventListener("keydown", handleEnterPressed);
    //     return () => {
    //         // Unbind the event listener on clean up
    //         document.removeEventListener("keydown", handleEnterPressed);
    //     };
    // });

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
        setCost(null);
        setVolume(null);
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
                selectedBeer.ottawayScore = score;
                props.onAdd(selectedBeer);
            } else {
                const beer: Beer = {
                    ottawayScore: score,
                    volume: volume,
                    price: cost,
                    name: beerName,
                    nameDisplay: beerName
                };
                props.onAdd(beer);
            }
        } else {
            console.log('ERROR not all fields filled out.')
            //TODO: Display errors
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Add Beer</ModalHeader>
            <ModalBody>
                <Form autoComplete={'off'}>
                    <BeerSearcher
                        getSelected={onBeerSelected}
                        onBeerSwitch={onBeerSwitch}
                        focused={focusedInput === CalculationItemInput.BEER_NAME}
                        onFocus={() => setFocusedInput(CalculationItemInput.BEER_NAME)}
                        getName={name => setBeerName(name)}
                        text={beerName}
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
                        props.showScore && score && score > -1 &&
                            <p>{"Ottaway Score: " + score.toFixed(2)}</p>
                    }
                    <Button onClick={onAdd}>Add</Button>
                </Form>
            </ModalBody>
        </Modal>
    )
}