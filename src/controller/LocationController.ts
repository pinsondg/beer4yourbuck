
export function getLocation(successCallback: PositionCallback, errorCallBack?: PositionErrorCallback) {
    if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallBack);
    }
}


/**
 * Returns the distance in meters from one lat lon to another
 */
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d * 1000;
}

export function metersToMiles(meters: number): number {
    return meters * 0.000621371;
}

export function milesToMeters(miles: number): number {
    return miles * 1609.34;
}

function deg2rad(deg: number) {
    return deg * (Math.PI/180)
}