import React, {useEffect, useState} from "react";
import BreweryDBAPI from "../../controller/api/BreweryDBAPI";
import {Beer} from "../../model/Beer";
import {BeerItemBrick, Place} from "../../component/brick/BeerItemBrick";
import {BeerVenue} from "../../model/BeerVenue";

interface Props {

}

const beerAPI = new BreweryDBAPI();

export function LocationCompare(props: Props) {
    const [beers, setBeers] = useState<Beer[]>([]);
    const venue: BeerVenue = {name: 'Billy Jacks', id: '1234'};

    useEffect(() => {
        beerAPI.searchBeer("Bud Light").then(beer => {
            const beerObj: Beer = beer.data[0];
            beerObj.volume = 12;
            beerObj.price = 5;
            const beers: Beer[] = [];
            beers.push(beerObj);
            setBeers(beers)
        });
    }, [props]);

    return (
        <div>
            {
                beers.length > 0 && <BeerItemBrick
                    beer={beers[0]}
                    id={'0'}
                    onEditSelect={() => {console.log("Edit!")}}
                    venue={venue}
                    isEditable={true}
                    place={Place.NONE}
                />
            }
        </div>
    )

}