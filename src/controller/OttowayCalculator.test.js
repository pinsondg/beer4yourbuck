import {OttawayCalculator} from "./OttawayCalculator";

it('ottaway calculation', () => {
    expect(OttawayCalculator.calculate(1, 1, 1, 1)).toEqual(0.078125);
    expect(OttawayCalculator.calculate(5.0, 4.50, 12, 1)).toBeCloseTo(1.041667, 3);
});