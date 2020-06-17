import React, {ReactNode, useEffect, useRef, useState} from "react";
import Beer4YourBuckAPI from "../../../controller/api/Beer4YourBuckAPI";
import {Beer, BeerInterface} from "../../../model/Beer";
import {Col, Dropdown, DropdownMenu, DropdownToggle, FormGroup, FormText, Input, Label, Table} from "reactstrap";
import './beer-searcher.css'
import {CustomInput} from "../CustomInput";
import {CalculationItemInput} from "../../modal/beerAdd/BeerAddModal";

const beerApi = Beer4YourBuckAPI.getInstance();

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

    const onBeerSelected = (untappedId: number | undefined) => {
        const beer = foundBeers.filter(x => x.untappedId === untappedId)[0];
        if (beer != null) {
            prop.getSelected(beer);
            if (beer.name) {
                setText(beer.name);
            }
            setSelectedBeer(beer);
        }
        setHideList(true);
    };

    const handleFocus = () => {
        if (prop.onFocus) {
            prop.onFocus(CalculationItemInput.BEER_NAME);
        }
    };

    const generateBody = (): ReactNode[] => {
        const rows: ReactNode[] = [];
        if (foundBeers) {
            foundBeers.forEach(beer => {
                rows.push(
                    <tr onClick={() => onBeerSelected(beer.untappedId)} key={beer.untappedId}>
                        <td>
                            {beer.breweryName}
                        </td>
                        <td>
                            {beer.name}
                        </td>
                        <td>
                            {beer.abv}
                        </td>
                    </tr>
                );
            });
        }
        return rows;
    };

    return (
        <div className={'beer-searcher'} ref={wrapperRef}>
            <FormGroup row>
                <Label sm={'2'} for={'beer-search'}>Beer Name</Label>
                <Col sm={'10'} style={{position: 'relative'}}>
                    <Input
                        id={'beer-search'}
                        className={'custom-input'}
                        value={text}
                        onChange={onChange}
                        onFocus={handleFocus}
                        name={'beer-search'}
                    />
                    <Dropdown isOpen={!hideList && foundBeers && foundBeers.length > 0} toggle={() => setHideList(!hideList)}>
                        <DropdownToggle tag={"span"} style={{width: 0, height: 0, opacity: 0, padding: 0, margin: 0}}/>
                        <DropdownMenu className={'beer-select'}>
                            <Table className={'beer-select-table'} hover style={{maxHeight: '300px'}}>
                                <thead>
                                    <tr className={'header-row'}>
                                        <th>Brewery</th>
                                        <th>Beer Name</th>
                                        <th>ABV</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {generateBody()}
                                </tbody>
                            </Table>
                        </DropdownMenu>
                    </Dropdown>
                    <FormText>For best results, search for Brewery Name + Beer Name</FormText>
                </Col>
            </FormGroup>
        </div>
    )
}
