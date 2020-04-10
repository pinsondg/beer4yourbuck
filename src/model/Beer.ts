/**
 * Represents a beer.
 */
import {OttawayCalculator} from "../controller/OttawayCalculator";

export interface BeerInterface {
    name?: string;
    id?: string;
    nameDisplay?: string;
    description?: string;
    abv?: string;
    isRetired?: string;
    labels?: BeerIconLabels;
    price?: number
    volume?: number
    verified?: boolean
}

export class Beer implements BeerInterface {

    name?: string;
    id?: string;
    nameDisplay?: string;
    description?: string;
    abv?: string;
    isRetired?: string;
    labels?: BeerIconLabels;
    price?: number;
    volume?: number;
    verified?: boolean;

    getOttawayScore(): number {
        if (this.volume && this.abv && this.price) {
            return OttawayCalculator.calculate(+this.abv, this.price, this.volume);
        }
        return -1;
    }

    static Builder =  class Builder {
        private name?: string;
        private id?: string;
        private nameDisplay?: string;
        private description?: string;
        private abv?: string;
        private isRetired?: string;
        private labels?: BeerIconLabels;
        private price?: number;
        private volume?: number;
        private verified?: boolean;

        withName(name: string): Builder {
            this.name = name;
            return this;
        }

        withId(id: string): Builder{
            this.id = id;
            return this;
        }

        withNameDisplay(nameDisplay: string): Builder {
            this.nameDisplay = nameDisplay;
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

        withIsRetired(isRetired: string): Builder {
            this.isRetired = isRetired;
            return this;
        }

        withLabels(labels: BeerIconLabels): Builder {
            this.labels = labels;
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

        withBeer(beer: BeerInterface): Builder {
            this.volume = beer.volume;
            this.nameDisplay = beer.nameDisplay;
            this.price = beer.price;
            this.abv = beer.abv;
            this.name = beer.name;
            this.labels = beer.labels;
            this.isRetired = beer.isRetired;
            this.id = beer.id;
            this.description = beer.description;
            this.verified = beer.verified;
            return this;
        }

        build(): Beer {
            let beer = new Beer();
            beer.name = this.name;
            beer.id = this.id;
            beer.volume = this.volume;
            beer.price = this.price;
            beer.nameDisplay = this.nameDisplay;
            beer.description = this.description;
            beer.abv = this.abv;
            beer.volume = this.volume;
            beer.isRetired = this.isRetired;
            beer.labels = this.labels;
            beer.verified = this.verified;
            return beer;
        }
    }

}

/**
 * Contains links to a beer icon/label image.
 */
export interface BeerIconLabels {
    icon?: string;
    medium?: string;
    large?: string;
    contentAwareIcon?: string;
    contentAwareMedium?: string;
    contentAwareLarge?: string;
}