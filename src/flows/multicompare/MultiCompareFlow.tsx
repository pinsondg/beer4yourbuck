import React, {useState} from "react";
import BeerItem, {BeerItemBrick, Place} from "../../component/brick/BeerItemBrick";
import {Button} from "reactstrap";
import BeerAddModal from "../../component/modal/BeerAddModal";
import {Beer} from "../../model/Beer";
import './multi-compare-flow.css'
import {MdAdd} from "react-icons/all";

interface Props {

}

let beerId = 0;

export function MultiCompareFlow(props: Props) {
    const [beerBricks, setBeerBricks] = useState<BeerItem[]>([]);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    // const [editingBeer, setEditingBeer] = useState<BeerItem | undefined>(undefined);

    const onBeerAdded = (beer: Beer) => {
        const newList = beerBricks.concat([{beer: beer, isEditable: true, onEditSelect: () => {}, id: beerId.toString(), place: Place.NONE}]);
        newList.sort((x,y) => {
            if (x.beer.ottawayScore && y.beer.ottawayScore) {
                return y.beer.ottawayScore - x.beer.ottawayScore;
            } else {
                return 0;
            }
        });
        newList.forEach((item, i) => {
            if (i === 0) {
                newList[i].place = Place.FIRST;
            } else if (i === 1) {
                newList[i].place = Place.SECOND;
            } else if (i === 2) {
                newList[i].place = Place.THIRD;
            } else {
                newList[i].place = Place.NONE;
            }
        });
        setBeerBricks(newList);
        beerId++;
        setShowAddModal(false);
    };

    return (
        <div style={{width: '100%', height: '100%'}}>
            <div className={'button-container'}>
                <Button className={'add-button'} onClick={() => setShowAddModal(true)}><MdAdd/></Button>
            </div>
            <div className={'list-holder'}>
                {
                    beerBricks.length === 0 && <p>List is empty. Add beer to compare.</p>
                }
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