/**
 * Represents a beer.
 */
import {OttawayCalculator} from "../controller/OttawayCalculator";

export interface BeerInterface {
    name?: string;
    untappedId?: number;
    breweryName?: string
    id?: string;
    description?: string;
    abv?: string;
    label?: string;
    price?: number;
    volume?: number;
    verified?: boolean;
    isPublished?: boolean;
}

export class Beer implements BeerInterface {

    name?: string;
    breweryName?: string;
    untappedId?: number;
    id?: string;
    description?: string;
    abv?: string;
    label?: string;
    price?: number;
    volume?: number;
    verified?: boolean;
    isPublished?: boolean;

    getOttawayScore(): number {
        if (this.volume && this.abv && this.price) {
            return OttawayCalculator.calculate(+this.abv, this.price, this.volume);
        }
        return -1;
    }

    static Builder =  class Builder {
        private name?: string;
        private breweryName?: string;
        private untappedId?: number;
        private id?: string;
        private description?: string;
        private abv?: string;
        private label?: string;
        private price?: number;
        private volume?: number;
        private verified?: boolean;
        private isPublished?: boolean;

        withName(name: string): Builder {
            this.name = name;
            return this;
        }

        withBreweryName(breweryName: string): Builder {
            this.breweryName = breweryName;
            return this;
        }

        withId(id: string): Builder{
            this.id = id;
            return this;
        }

        withUntappedId(id: number): Builder {
            this.untappedId = id;
            return this;
        }

        withDescription(description: string): Builder {
            this.description = description;
            return this;
        }

        withAbv(abv: string): Builder {
            this.abv = abv;
            return this;
        }

        withLabel(label: string): Builder {
            this.label = label;
            return this;
        }

        withPrice(price: number): Builder {
            this.price = price;
            return this;
        }

        withVolume(volume: number): Builder {
            this.volume = volume;
            return this;
        }

        withVerified(verified: boolean): Builder {
            this.verified = verified;
            return this;
        }

        withIsPublished(isPublished: boolean): Builder {
            this.isPublished = isPublished;
            return this;
        }

        withBeer(beer: BeerInterface): Builder {
            this.volume = beer.volume;
            this.untappedId = beer.untappedId;
            this.breweryName = beer.breweryName;
            this.price = beer.price;
            this.abv = beer.abv;
            this.name = beer.name;
            this.id = beer.id;
            this.description = beer.description;
            this.verified = beer.verified;
            this.label = beer.label;
            this.isPublished = beer.isPublished;
            return this;
        }

        build(): Beer {
            let beer = new Beer();
            beer.name = this.name;
            beer.untappedId = this.untappedId;
            beer.id = this.id;
            beer.volume = this.volume;
            beer.price = this.price;
            beer.description = this.description;
            beer.abv = this.abv;
            beer.volume = this.volume;
            beer.verified = this.verified;
            beer.label = this.label;
            beer.breweryName = this.breweryName;
            beer.isPublished = this.isPublished;
            return beer;
        }
    }

}