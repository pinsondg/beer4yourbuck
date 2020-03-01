import * as request from "request-promise-native";

export default class BreweryDBAPI {
    private url: string = process.env.REACT_APP_BACKEND_URL!;
    private sandbox_key: string = '32c462b931965d238a5b3ee95792182d';

    async searchBeer(name: string) {
        let result = (async () => {
            const baseUrl = this.url;
            const queryString = 'beer/search?&q=' + name + '&password=Pinson04';
            var options = {
                uri: baseUrl + queryString,
            };

            const result = await request.get(options);
            return result;
        })();
        return result;
    }
}