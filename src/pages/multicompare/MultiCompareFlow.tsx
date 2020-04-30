import React, {useContext, useEffect, useState} from "react";
import BeerItem, {BeerItemBrick, Place} from "../../component/brick/BeerItemBrick";
import {Button} from "reactstrap";
import BeerAddModal, {ModalType} from "../../component/modal/beerAdd/BeerAddModal";
import {Beer} from "../../model/Beer";
import './multi-compare-flow.css'
import {MdAdd} from "react-icons/md";
import {Flipped, Flipper} from "react-flip-toolkit";
import {CompareBeerContext} from "../../context/CompareBeerContext";
import {ConformationModal} from "../../component/modal/ConformationModal";
import {NotificationContext, NotificationType} from "../../context/NotificationContext";
import {BeerVenueContext} from "../../context/BeerVenueContext";
import Beer4YourBuckAPI from "../../controller/api/Beer4YourBuckAPI";

interface Props {
}

const api = new Beer4YourBuckAPI();

function sortList(list: BeerItem[]): BeerItem[] {
    const newList = [...list];
    newList.sort((x, y) => {
        if (x.beer.getOttawayScore() && y.beer.getOttawayScore()) {
            return y.beer.getOttawayScore() - x.beer.getOttawayScore();
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
        if (item.beer.getOttawayScore() === -1) {
            newList[i].place = Place.INVALID;
        }
    });
    return newList;
}

let beerId = 0;

interface EditBeer {
    shouldShow: boolean;
    brick: BeerItem;
}

export function MultiCompareFlow(props: Props) {
    const {setCompareBeers, compareBeers} = useContext(CompareBeerContext);
    const {notifications, setNotifications} = useContext(NotificationContext);
    const {venue} = useContext(BeerVenueContext);
    const [showVolumeModal, setShowVolumeModal] = useState<boolean>(false);
    const [beerBricks, setBeerBricks] = useState<BeerItem[]>([]);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
    const [edit, setEdit] = useState<EditBeer | null>(null);

    const updateBeerInBackend = (beer: Beer) => {
        if (venue) {
            api.addBeersToVenue(venue, beerBricks.map(beerBrick => beerBrick.beer)).then(() => {
                setNotifications([...notifications, {
                    title: "Beer Published!",
                    message: `${beer.name} has been successfully published to ${venue.name}`,
                    type: NotificationType.SUCCESS,
                    timeout: 3000
                }]);
                beer.isPublished = true;
                setBeerBricks([...beerBricks]);
            }).catch(() => {
                setNotifications([...notifications, {
                    title: "Beer Not Published!",
                    message: beerBricks[beerBricks.length - 1].beer.name + " was not added to " + venue.name + ".",
                    type: NotificationType.ERROR,
                    timeout: 5000
                }]);
            });
        }
    };

    const onBeerAdded = (beer: Beer) => {
        const newList = [...beerBricks, {beer: beer, isEditable: true, onEditSelect: () => {}, id: beerId.toString(), place: Place.NONE, onDeleteSelect: onDeleteSelect}];
        const sorted = sortList(newList);
        setBeerBricks(sorted);
        setCompareBeers(sorted.map(x => x.beer));
        beerId++;
        setShowAddModal(false);
    };

    const onDeleteSelect = (id: string) => {
        const newBeers = sortList(beerBricks.filter(x => x.id !== id));
        setBeerBricks(newBeers);
        setCompareBeers(newBeers.map(x => x.beer))
    };

    const clear = () => {
        setBeerBricks([]);
        setCompareBeers([]);
        setShowClearConfirm(false);
    };

    useEffect(() => {
        const newList = sortList(beerBricks);
        if (JSON.stringify(newList) !== JSON.stringify(beerBricks)) {
            setBeerBricks(newList);
        }
    }, [beerBricks]);

    useEffect(() => {
        const compareBeerBricks = compareBeers.map(beer => {
            const brick: BeerItem = {
                id: beerId.toString(),
                beer: beer,
                onDeleteSelect: () => {},
                onEditSelect: () => {},
                place: Place.NONE,
                isEditable: true,
                isDeletable: true
            };
            beerId++;
            return brick;
        });
        if (compareBeers.length > 0 && !compareBeers.some(beer => beer.volume != null)) {
            setShowVolumeModal(true);
        }
        setBeerBricks(sortList(compareBeerBricks));
    }, [compareBeers]);

    const bulkChangeVolume = () => {
        const newCompareBeers = [...compareBeers];
        newCompareBeers.forEach(beer => beer.volume = 12);
        setCompareBeers(newCompareBeers);
        setShowVolumeModal(false);
    };

    const onEditSelect = (id: string) => {
        setEdit({shouldShow: true, brick: beerBricks.filter(x => x.id === id)[0]});
    };

    const onEditConfirm = (beer: Beer) => {
        if (edit) {
            const found = beerBricks.filter(x => x.id === edit.brick.id)[0];
            if (found) {
                found.beer = beer;
            }
            setBeerBricks([...beerBricks]);
            setCompareBeers(beerBricks.map(beerBrick => beerBrick.beer));
            setEdit({...edit, shouldShow: false});
        }
    };

    const onPublish = (id: string) => {
        const found = beerBricks.filter(x => x.id === id)[0].beer;
        updateBeerInBackend(found);
    };

    return (
        <div style={{width: '100%', position: 'relative', flex: '1 1 auto', maxHeight: '100%', overflow: 'hidden'}}>
            <Button className={'add-button'} color={'primary'} onClick={() => setShowAddModal(true)}><MdAdd size={25}/></Button>
            <div className={'list-holder'}>
                <Flipper flipKey={JSON.stringify(beerBricks.map(x => x.id))}>
                    {
                        beerBricks.length === 0 && <p>List is empty. Add beer to compare and publish.</p>
                    }
                    {
                        beerBricks.map(beerBrick =>
                            <Flipped flipId={"beerBricks"} key={beerBrick.id} translate={true}>
                                <div>
                                    <BeerItemBrick
                                        beer={beerBrick.beer}
                                        id={beerBrick.id}
                                        isEditable={beerBrick.isEditable}
                                        onEditSelect={onEditSelect}
                                        key={beerBrick.id}
                                        place={beerBrick.place}
                                        onDeleteSelect={onDeleteSelect}
                                        isDeletable={true}
                                        onPublish={venue ? onPublish : undefined}
                                    />
                                </div>
                            </Flipped>
                        )
                    }
                </Flipper>
                {
                    beerBricks.length > 0 && <Button color={'danger'} onClick={() => setShowClearConfirm(true)}>Clear</Button>
                }
            </div>
            {
                showAddModal && <BeerAddModal modalType={ModalType.ADD} show={showAddModal} onConfirm={onBeerAdded} onClose={() => setShowAddModal(false)}/>
            }
            {
                showClearConfirm && <ConformationModal show={showClearConfirm} onYes={clear} onNo={() => setShowClearConfirm(false)} onClose={() => setShowClearConfirm(false)} text={"Are you sure you want to clear all beers?"}/>
            }
            {
                showVolumeModal && <ConformationModal show={showVolumeModal} onYes={bulkChangeVolume} onNo={() => setShowVolumeModal(false)} onClose={() => setShowVolumeModal(false)}
                                                      text={"We could not find any volumes for this comparison. Would you like to set the volume for every beer to the same baseline of 12 fl oz?"}
                                                      header={"No volume found!"}
                />
            }
            {
                edit && edit.shouldShow && <BeerAddModal initialBeer={edit.brick.beer} show={edit.shouldShow} modalType={ModalType.EDIT} onConfirm={onEditConfirm} onClose={() => {setEdit({...edit, shouldShow: false})}}/>
            }
        </div>
    )
}