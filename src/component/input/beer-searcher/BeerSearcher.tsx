import React, {useEffect, useRef, useState} from "react";
import Beer4YourBuckAPI from "../../../controller/api/Beer4YourBuckAPI";
import {Beer, BeerInterface} from "../../../model/Beer";
import SelectableList from "../../list/selectable-list/SelectableList";
import {Col, FormGroup, Input, Label, Row} from "reactstrap";
import './beer-searcher.css'
import {CustomInput} from "../CustomInput";
import {CalculationItemInput} from "../../modal/beerAdd/BeerAddModal";

const beerApi = new Beer4YourBuckAPI();

export interface BeerSearcherProp extends CustomInput{
    getSelected: (beer: Beer) => void
    onBeerSwitch: () => void;
    getName: (name: string) => void;
    error?: boolean
    text?: string
    selectedBeer?: Beer;
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

    useEffect(() => {
        if (prop.selectedBeer) {
            setSelectedBeer(prop.selectedBeer);
        }
    }, [prop]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setText(val);
        prop.getName(val);
        setHideList(false);
        if (selectedBeer && selectedBeer.name !== val) {
            setSelectedBeer(null);
            prop.onBeerSwitch();
        }
        if (val && val !== '' && val.length % 2 === 0) {
            const promise = beerApi.searchBeer(val);
            promise.then((data) => {
                let beer: Array<Beer> = data.data.map((x: BeerInterface) => new Beer.Builder().withBeer(x).build());
                setFoundBeers(beer.filter(x => x.abv));
            });
        } else if (val.length === 0) {
            setFoundBeers([]);
        }
    };

    const onBeerSelected = (index: number) => {
        const beer = foundBeers[index];
        if (beer != null) {
            prop.getSelected(beer);
            if (beer.name) {
                setText(beer.name);
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
                                    <p>{beer.breweryName}</p>
                                </Col>
                                <Col>
                                    <p>{beer.name}</p>
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
