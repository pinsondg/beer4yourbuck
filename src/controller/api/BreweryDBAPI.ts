import * as request from "request-promise-native";

export default class BreweryDBAPI {
    private url: string = process.env.REACT_APP_BACKEND_URL!;

    async searchBeer(name: string) {
        let result = (async () => {
            const baseUrl = this.url;
            const queryString = 'beer/search?&q=' + name;
            var options = {
                uri: baseUrl + queryString,
            };

            const result = await request.get(options);
            return result;
        })();
        return result;
    }
}