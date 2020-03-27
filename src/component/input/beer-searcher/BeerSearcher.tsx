import React, {useEffect, useRef, useState} from "react";
import BreweryDBAPI from "../../../controller/api/BreweryDBAPI";
import {Beer, BeerInterface} from "../../../model/Beer";
import SelectableList from "../../list/selectable-list/SelectableList";
import {Col, FormGroup, Input, Label, Row} from "reactstrap";
import './beer-searcher.css'
import {CustomInput} from "../CustomInput";
import {CalculationItemInput} from "../../modal/BeerAddModal";

const beerApi = new BreweryDBAPI();

export interface BeerSearcherProp extends CustomInput{
    getSelected: (beer: Beer) => void
    onBeerSwitch: () => void;
    getName: (name: string) => void;
    error?: boolean
    text?: string
}

export default function BeerSearcher(prop: BeerSearcherProp) {
    const [text, setText] = useState<string>('');
    const [foundBeers, setFoundBeers] = useState<Array<Beer>>([]);
    const [selectedBeer, setSelectedBeer] = useState<Beer | null>(null);
    const [hideList, setHideList] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (e: MouseEvent): any => {
        if (e.target instanceof HTMLElement
            && wrapperRef
            && wrapperRef.current
            && !wrapperRef.current.contains(e.target)) {
            setHideList(true);
        }
    };

    useEffect(() => {
        if (prop.text) {
            setText(prop.text);
        }
    }, [prop.text]);

    //const inputClasses = classNames('cusom-input', {'error': prop.error});

    useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setText(val);
        prop.getName(val);
        setHideList(false);
        if (selectedBeer && selectedBeer.nameDisplay !== val) {
            setSelectedBeer(null);
            prop.onBeerSwitch();
        }
        if (val && val !== '') {
            const promise = beerApi.searchBeer(val);
            promise.then((data) => {
                let beer: Array<Beer> = data.data.map((x: BeerInterface) => new Beer.Builder().withBeer(x).build());
                setFoundBeers(beer.filter(x => x.abv));
            });
        } else {
            setFoundBeers([]);
        }
    };

    const onBeerSelected = (index: number) => {
        const beer = foundBeers[index];
        if (beer != null) {
            prop.getSelected(beer);
            if (beer.nameDisplay) {
                setText(beer.nameDisplay);
            }
        }
        setHideList(true);
        setSelectedBeer(foundBeers[index]);
    };

    const handleFocus = () => {
        if (prop.onFocus) {
            prop.onFocus(CalculationItemInput.BEER_NAME);
        }
    };

    return (
        <div className={'beer-searcher'} ref={wrapperRef}>
            <FormGroup row>
                <Label sm={'2'} for={'beer-search'}>Beer Name</Label>
                <Col sm={'10'}>
                    <Input
                        id={'beer-search'}
                        className={'custom-input'}
                        value={text}
                        onChange={onChange}
                        onFocus={handleFocus}
                        name={'beer-search'}
                    />
                    {
                        foundBeers && foundBeers.length > 0 &&
                        <SelectableList components={foundBeers.map((beer) => (
                            <Row key={beer.id}>
                                <Col>
                                    <p>{beer.nameDisplay}</p>
                                </Col>
                                <Col>
                                    <p>{beer.abv}</p>
                                </Col>
                            </Row>
                        ))}
                                        getSelected={onBeerSelected}
                                        hide={hideList}
                                        showShadow={true}
                        />
                    }
                </Col>
            </FormGroup>
        </div>
    )
}
