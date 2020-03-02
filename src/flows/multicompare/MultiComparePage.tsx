import React, {CSSProperties, useState} from "react";
import CalculationItem from "./CalculationItem";
import {Button, Col, Row} from "reactstrap";
import classNames from "classnames";
import './multi-compare-page.css';
import '../../App.css'
import FlipMove from "react-flip-move";

let itemKey = 0;

interface MultiComparePageProps {

}

interface RemovableCalculationItemProps {
    onRemove?: (item: RemovableCalculationItemProps) => void;
    key: number;
    id: number
    onScoreCalculated?: (score: number, id: number) => void;
    disableDelete: boolean
    topItem?: boolean;
}

function RemovableCalculationItem(props: RemovableCalculationItemProps) {

    const classes = classNames('removable-calculation', {
        'top': props.topItem
    });

    const handleRemoveButtonClick = () => {
        if (props.onRemove) {
            props.onRemove(props)
        }
    };

    const onScoreCalculated = (score: number) => {
        if (props.onScoreCalculated && score > -1) {
            props.onScoreCalculated(score, props.id);
        }
    };

    return (
        <div className={classes}>
            <Row style={{padding: '10px'}}>
                <Col sm={props.disableDelete ? '12' : '10'}>
                    <CalculationItem onScoreCalculated={onScoreCalculated}/>
                </Col>
                {
                    !props.disableDelete ? (
                        <Col sm={'2'}>
                            <Button color={'danger'} style={{margin: '0 auto'}} onClick={handleRemoveButtonClick}>Remove</Button>
                        </Col>
                    ) : null
                }
            </Row>
        </div>
    )
}

interface RemovableItemCalculationObject extends RemovableCalculationItemProps {
    score: number;
}

export function MultiComparePage() {

    const [calculationItems, setCalculationItems] = useState<Array<RemovableItemCalculationObject>>([{key: itemKey, id: itemKey, score: 0, disableDelete: true}]);

    const onRemoveItemClick = (item: RemovableCalculationItemProps) => {
        const items = calculationItems.filter(x => x.id !== item.id);
        items.forEach(x => x.topItem = false);
        if (items.length <= 1) {
            items[0].disableDelete = true;
        }
        setCalculationItems(items);
    };

    const onAddClick = () => {
        itemKey++;
        const items = [];
        calculationItems.forEach((x) => {
            x.disableDelete = false;
            x.topItem = false;
            items.push(x)
        });
        items.push({key: itemKey, id: itemKey, score: 0, disableDelete: false});
        setCalculationItems(items);
    };

    const onScoreCalculated = (score: number, id: number) => {
        const items: Array<RemovableItemCalculationObject> = [];
        calculationItems.forEach(x => {
            if (x.id === id) {
                x.score = score
            }
            x.topItem = false;
            items.push(x)
        });
        setCalculationItems(items);
    };

    const cssProperties: CSSProperties = {
        width: '100%',
        overflow: 'hidden',
        padding: '5px'
    };

    const onCompareCLick = () => {
        const newItems: Array<RemovableItemCalculationObject> = [];
        calculationItems.sort((a, b) => b.score - a.score).forEach(x => newItems.push(x));
        let topVal = newItems[0].score;
        newItems.forEach(x => {
            if (x.score === topVal) {
                x.topItem = true;
            }
        });
        newItems[0].topItem = true;
        setCalculationItems(newItems);
    };

    const clearAll = () => {
        itemKey++;
        setCalculationItems([{key: itemKey, score: 0, id: itemKey, disableDelete: true}])
    };

    const compareButtonToggle = () => {
        return calculationItems.filter(item => item.score === 0).length === 0 && calculationItems.length > 1;
    };

    return (
        <div className={'holder'} style={cssProperties}>
            <div style={{margin: '5px'}}>
                    {
                        calculationItems.map(item => (
                            <RemovableCalculationItem
                                onRemove={onRemoveItemClick}
                                key={item.key}
                                id={item.id}
                                onScoreCalculated={onScoreCalculated}
                                disableDelete={item.disableDelete}
                                topItem={item.topItem}
                            />
                        ))
                    }
            </div>
            <div>
                <Button style={{margin: '0 auto'}} color={'primary'} onClick={onAddClick}>Add New Item</Button>
                {
                    compareButtonToggle() ? (
                        <Button style={{margin: '0 auto'}} color={'success'} onClick={onCompareCLick}>Compare!</Button>
                    ) : null
                }
                {
                    calculationItems.length > 1 ? (
                        <Button style={{margin: '0 auto'}} color={'danger'} onClick={clearAll}>Clear</Button>
                    ) : null
                }
            </div>
        </div>
    );
}