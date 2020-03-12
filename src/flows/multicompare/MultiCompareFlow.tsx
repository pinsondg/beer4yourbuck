import React, {useState} from "react";
import BeerItem, {BeerItemBrick, Place} from "../../component/brick/BeerItemBrick";
import {Button} from "reactstrap";
import BeerAddModal from "../../component/modal/BeerAddModal";
import {Beer} from "../../model/Beer";
import './multi-compare-flow.css'

interface Props {

}

let beerId = 0;

export function MultiCompareFlow(props: Props) {
    const [beerBricks, setBeerBricks] = useState<BeerItem[]>([]);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    // const [editingBeer, setEditingBeer] = useState<BeerItem | undefined>(undefined);

    const onBeerAdded = (beer: Beer) => {
        setBeerBricks(beerBricks.concat([{beer: beer, isEditable: true, onEditSelect: () => {}, id: beerId.toString(), place: Place.NONE}]))
        beerId++;
        setShowAddModal(false);
    };

    const onCompare = () => {
        const newList: BeerItem[] = [];
        beerBricks.sort((x,y) => {
            if (x.beer.ottawayScore && y.beer.ottawayScore) {
                return y.beer.ottawayScore - x.beer.ottawayScore;
            } else {
                return 0;
            }
        }).forEach(x => newList.push(x));
        newList.forEach(x => x.isEditable = false);
        if (newList.length > 0) {
            newList[0].place = Place.FIRST;
        }
        if (newList.length > 1) {
            newList[1].place = Place.SECOND;
        }
        if(newList.length  > 2) {
            newList[2].place = Place.THIRD;
        }
        setBeerBricks(newList);
    };

    return (
        <div className={'page-container'}>
            <div>
                <Button onClick={() => setShowAddModal(true)}>Add</Button>
                <Button disabled={!(beerBricks.length > 1)} onClick={onCompare}>Compare!</Button>
            </div>
            <div className={'list-holder'}>
                {
                    beerBricks.map(beerBrick =>
                        <BeerItemBrick
                            beer={beerBrick.beer}
                            id={beerBrick.id}
                            isEditable={beerBrick.isEditable}
                            onEditSelect={beerBrick.onEditSelect}
                            key={beerBrick.id}
                            place={beerBrick.place}
                        />
                    )
                }
            </div>
            {
                showAddModal && <BeerAddModal show={showAddModal} onAdd={onBeerAdded} onClose={() => setShowAddModal(false)}/>
            }
        </div>
    )
}