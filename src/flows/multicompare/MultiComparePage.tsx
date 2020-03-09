import React, {CSSProperties, useState} from "react";
import CalculationItem from "./CalculationItem";
import {Button, Col, Row} from "reactstrap";
import classNames from "classnames";
import './multi-compare-page.css';
import '../../App.css'

let itemKey = 0;

interface MultiComparePageProps {

}

interface RemovableCalculationItemProps {
    onRemove?: (item: RemovableCalculationItemProps) => void;
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
                    !props.disableDelete &&
                    <Col sm={'2'}>
                        <Button color={'danger'} style={{margin: '0 auto'}} onClick={handleRemoveButtonClick}>Remove</Button>
                    </Col>
                }
            </Row>
        </div>
    )
}

interface RemovableItemCalculationObject extends RemovableCalculationItemProps {
    score: number;
}

export function MultiComparePage() {

    const [calculationItems, setCalculationItems] = useState<Array<RemovableItemCalculationObject>>([{id: itemKey, score: 0, disableDelete: true}]);

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
        items.push({id: itemKey, score: 0, disableDelete: false});
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
        height: "100%",
        overflowX: 'hidden',
        overflowY: "hidden",
        padding: '5px',
        flex: '1 1 auto'
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
        setCalculationItems([{score: 0, id: itemKey, disableDelete: true}])
    };

    const compareButtonToggle = () => {
        return !(calculationItems.filter(item => item.score === 0).length === 0 && calculationItems.length > 1);
    };

    return (
        <div style={cssProperties}>
            <div className={'list-holder'}>
                {
                    calculationItems.map(item => (
                        <RemovableCalculationItem
                            onRemove={onRemoveItemClick}
                            key={item.id}
                            id={item.id}
                            onScoreCalculated={onScoreCalculated}
                            disableDelete={item.disableDelete}
                            topItem={item.topItem}
                        />
                    ))
                }
            </div>
            <div className={'bottom-buttons-holder'}>
                <Row xs={12} >
                    <Button className={'control-button'} color={'primary'} onClick={onAddClick}>Add New Item</Button>
                </Row>
                <Row xs={12}>
                    <Button className={'control-button'} color={'success'} disabled={compareButtonToggle()} onClick={onCompareCLick}>Compare!</Button>
                </Row>
                <Row xs={12}>
                {
                    calculationItems.length > 1 &&
                    <Button className={'control-button'}
                            color={'danger'}
                            onClick={clearAll}>Clear
                    </Button>
                }
                </Row>
            </div>
        </div>
    );
}