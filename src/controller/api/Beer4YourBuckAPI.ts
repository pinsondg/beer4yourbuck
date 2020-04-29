import {BeerVenue, GooglePlace} from "../../model/BeerVenue";
import {Beer} from "../../model/Beer";
import {UserType} from "../../model/User";

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
        return axios.post(this.url + 'venue', {
            googlePlaceId: googlePlace.placeId,
            beers: initialBeers
        }, {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        });
    }

    async addBeersToVenue(venue: BeerVenue, beers: Beer[]) {
        return axios.post(this.url + `venue/${venue.id}/beers`, beers, {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        });
    }

    async voteOnBeer(beer: Beer, upvote: boolean) {
        return axios.post(this.url + `beer/vote/${beer.id}`, {}, {
            params: {
                vote: upvote ? 'upvote' : 'downvote'
            }
        });
    }

    async getUserBeerActivityInfo() {
        return axios.get(this.url + 'beer/user');
    }

    async login(usernameOrEmail: string, password: string, rememberMe: boolean) {
        const formData = new FormData();
        formData.append('user', usernameOrEmail);
        formData.append('password', password);
        if (rememberMe) {
            formData.append('remember-me','on');
        }
        return axios.post(this.url + '/auth/login', formData, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'accept': 'application/json'
            }
        })
    }

    async register(userName: string, email: string, password: string) {
        return axios.post(this.url + '/auth/register', {
            userName: userName,
            email: email,
            password: password,
            role: UserType.PATRON
        }, {
            headers: {
                'content-type': 'application/json'
            }
        });
    }

    async getUserDetails() {
        return axios.get(this.url + '/auth/user');
    }

    async logout() {
        return axios.post(this.url + '/auth/logout');
    }

    async getTotalNumberReportedBeers() {
        return axios.get(this.url + 'beer/count');
    }

    async getTotalNumberReportedVenues() {
        return axios.get(this.url + 'venue/count');
    }

    async getBeerVotedScore(beer: Beer) {
        return axios.get(this.url + `/beer/vote/${beer.id}`);
    }
}