import {BeerVenue, GooglePlace} from "../../model/BeerVenue";
import {Beer} from "../../model/Beer";

const axios = require('axios').default;

export default class Beer4YourBuckAPI {
    private url: string = process.env.REACT_APP_BACKEND_URL!;

    async searchBeer(name: string) {
        return axios.get(this.url + "beer/search", {
            params: {
                q: name
            }
        });
    }

    async searchPossibleVenueNearYou(lat: number, lon: number, radius: number) {
        return axios.get(this.url + "venue/places", {
            params: {
                lat: lat,
                lon: lon,
                radius: radius
            }
        });
    }

    async uploadImage(file: File) {
        const formData = new FormData();
        formData.append('image', file);
        return axios.post(this.url + 'menu/process', formData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
    }
    
    async checkJobStatus(jobId: number) {
        return axios.get(this.url + 'menu/process/' + jobId)
    }

    async getVenuesNearYou(lat: number, lon: number, radius: number) {
        return axios.get(this.url + 'venue/search', {
            params: {
                latlon: lat.toFixed(5) + ',' + lon.toFixed(5),
                radius: radius
            }
        });
    }

    async getVenueByGooglePlacesId(id: string) {
        return axios.get(this.url + 'venue/places/' + id);
    }

    async createNewVenue(googlePlace: GooglePlace, initialBeers: Beer[]) {
        return axios.post(this.url + 'venue/', {
            googlePlaceId: googlePlace.placeId,
            beers: initialBeers
        });
    }

    async addBeersToVenue(venue: BeerVenue, beers: Beer[]) {
        return axios.post(`venue/${venue.id}/beers`, beers, {
            headers: {
                'content-type': 'application/json'
            }
        });
    }
}