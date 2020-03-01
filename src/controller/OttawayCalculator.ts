export class OttawayCalculator {

    static calculate(apv: number, cost: number, volume: number) {
        return apv * volume / cost / 12.8;
    }
}