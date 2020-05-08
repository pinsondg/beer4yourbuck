export class OttawayCalculator {

    static calculate(abv: number, cost: number, volume: number, count: number) {
        return (abv * volume * count) / cost / 12.8;
    }
}