import * as request from "request-promise-native";

export default class BreweryDBAPI {
    private url: string = process.env.REACT_APP_BACKEND_URL!;

    async searchBeer(name: string) {
        return (async () => {
            const baseUrl = this.url;
            const queryString = 'beer/search?&q=' + name;
            const options = {
                uri: baseUrl + queryString,
            };
            return request.get(options);
        })();
    }

    async searchBreweryByLocation(lat: number, lon: number) {
        return (async () => {
            const baseUrl = this.url;
            const options = {
                method: 'GET',
                uri: baseUrl + 'brewery/search?lat=' + lat + '&lng=' + lon,
            };
            return request.get(options);
        })();
    }
}