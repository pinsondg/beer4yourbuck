
export function getLocation(successCallback: PositionCallback, errorCallBack?: PositionErrorCallback) {
    if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallBack);
    }
}