const axios = require('axios').default;

export default class BreweryDBAPI {
    private url: string = process.env.REACT_APP_BACKEND_URL!;

    async searchBeer(name: string) {
        return axios.get(this.url + "beer/search", {
            params: {
                q: name
            }
        });
    }

    async searchBreweryByLocation(lat: number, lon: number) {
        return axios.get(this.url + "brewery/search", {
            params: {
                lat: lat,
                lng: lon
            }
        });
    }
}