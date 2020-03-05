import React, {useEffect, useRef, useState} from "react";
import BreweryDBAPI from "../../../controller/api/BreweryDBAPI";
import Beer from "../../../model/Beer";
import SelectableList from "../../list/selectable-list/SelectableList";
import {Input} from "reactstrap";
import './beer-searcher.css'
import {CustomInput} from "../CustomInput";
import {CalculationItemInput} from "../../../flows/multicompare/CalculationItem";

const beerApi = new BreweryDBAPI();

export interface BeerSearcherProp extends CustomInput{
    getSelected: (beer: Beer) => void
    onBeerSwitch: () => void;
    error?: boolean
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
        setHideList(false);
        if (selectedBeer && selectedBeer.nameDisplay !== val) {
            setSelectedBeer(null);
            prop.onBeerSwitch();
        }
        if (val && val !== '') {
            const promise = beerApi.searchBeer(val);
            promise.then((data) => {
                let beer: Array<Beer> = JSON.parse(data);
                setFoundBeers(beer.filter(x => x.abv))
            });
        } else {
            setFoundBeers([]);
        }
    };

    const onBeerSelected = (selectedBeer: Beer) => {
        setSelectedBeer(selectedBeer);
        prop.getSelected(selectedBeer);
        if (selectedBeer.nameDisplay) {
            setText(selectedBeer.nameDisplay);
        }
        setHideList(true);
    };

    const handleFocus = () => {
        if (prop.onFocus) {
            prop.onFocus(CalculationItemInput.BEER_NAME);
        }
    };

    return (
        <div className={'beer-searcher'} ref={wrapperRef}>
            <Input
                className={'custom-input'}
                value={text}
                placeholder={'Beer Name'}
                onChange={onChange}
                onFocus={handleFocus}
            />
            {
                foundBeers && foundBeers.length > 0 ? (
                    <SelectableList beers={foundBeers} getSelected={onBeerSelected} hide={hideList}/>
                ) : null
            }
        </div>
    )
}
