export class OttawayCalculator {

    static calculate(abv: number, cost: number, volume: number, count: number) {
        return (abv * volume * count) / cost / 12.8;
    }

    static normalize(scores: number[], min: number, max: number): number[] {
        let minVal = Math.min(...scores);
        let maxVal = Math.max(...scores);

        return scores.map(score => (score - minVal) / (maxVal - minVal))
    }
}