import {formatDaysOfWeek} from "./CurrentVenue";

describe('formatDaysOfWeek should show correct days', () => {
    it('should show "MON-WED, SAT"', function () {
        expect(formatDaysOfWeek(["MONDAY", "TUESDAY", "WEDNESDAY", "SATURDAY"])).toEqual("MON-WED, SAT");
    });
    it('should show "MON, WED, FRI"', function () {
        expect(formatDaysOfWeek(["MONDAY", "WEDNESDAY", "FRIDAY"])).toEqual("MON, WED, FRI");
    });
    it('should show "MON, TUE, THU"', function () {
        expect(formatDaysOfWeek(["MONDAY", "TUESDAY", "THURSDAY"])).toEqual("MON, TUE, THU");
    });
    it('should show "SUN-SAT"', function () {
        expect(formatDaysOfWeek(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"])).toEqual("SUN-SAT");
    });
    it('should show "MON-THU, SAT"', function () {
        expect(formatDaysOfWeek(["WEDNESDAY", "MONDAY", "THURSDAY", "TUESDAY", "SATURDAY"])).toEqual("MON-THU, SAT");
    });
    it('should show "SUN-TUE, THU-SAT"', function () {
        expect(formatDaysOfWeek(["SUNDAY", "MONDAY", "TUESDAY", "THURSDAY", "FRIDAY", 'SATURDAY'])).toEqual("SUN-TUE, THU-SAT");
    });
    it('should show "SUN, THU-SAT"', function () {
        expect(formatDaysOfWeek(["SUNDAY", "THURSDAY", "FRIDAY", "SATURDAY"])).toEqual("SUN, THU-SAT");
    });
});