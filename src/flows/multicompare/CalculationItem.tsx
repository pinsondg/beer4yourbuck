import React, {useEffect, useState} from "react";
import BeerSearcher from "../../component/input/beer-searcher/BeerSearcher";
import {Col, Row} from "reactstrap";
import APVInput from "../../component/input/apv-input/APVInput";
import {Beer} from "../../model/Beer";
import CostInput from "../../component/input/cost-input/CostInput";
import VolumeInput from "../../component/input/volume-input/VolumeInput";
import {OttawayCalculator} from "../../controller/OttawayCalculator";

interface CalculationItemProps {
    errors?: InputErrors
    onScoreCalculated?: (score: number) => void;
    showScore?: boolean
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

export default function CalculationItem(props: CalculationItemProps) {
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

    return (
        <div>
            <Row>
                <Col>
                    <BeerSearcher
                        getSelected={onBeerSelected}
                        onBeerSwitch={onBeerSwitch}
                        focused={focusedInput === CalculationItemInput.BEER_NAME}
                        onFocus={() => setFocusedInput(CalculationItemInput.BEER_NAME)}
                    />
                </Col>
                <Col>
                    <APVInput
                        text={apvInput ? apvInput.toString() : ''}
                        locked={selectedBeer !== null}
                        getVal={val => setApvInput(+val)}
                    />
                </Col>
                <Col>
                    <CostInput
                        getCost={getCost}
                        text={cost ? cost.toString() : ''}
                        error={inputErrors.beerError}
                    />
                </Col>
                <Col>
                    <VolumeInput
                        getVolume={getVolume}
                        text={volume ? volume.toString() : ''}
                        error={inputErrors.volumeError}
                    />
                </Col>
                {
                    props.showScore && score && score > -1 &&
                    <Col>
                        <p>{"Ottaway Score: " + score.toFixed(2)}</p>
                    </Col>
                }
            </Row>
        </div>

    )
}