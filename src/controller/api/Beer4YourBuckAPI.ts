import {BeerVenue, GooglePlace} from "../../model/BeerVenue";
import {Beer} from "../../model/Beer";
import {UserType} from "../../model/User";

const axios = require('axios').default.create({
    withCredentials: true
});

/**
 * Singleton api instance.
 */
export default class Beer4YourBuckAPI {
    private url: string = process.env.REACT_APP_BACKEND_URL!;
    private static instance: Beer4YourBuckAPI = new Beer4YourBuckAPI();

    private constructor() {

    }

    static getInstance() {
        return this.instance;
    }

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
        return axios.post(this.url + 'auth/login', formData, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'accept': 'application/json'
            }
        })
    }

    async register(userName: string, email: string, password: string, firstName: string, lastName: string) {
        if (lastName === '') {
            lastName = 'secret';
        }
        return axios.post(this.url + 'auth/register', {
            userName: userName,
            email: email,
            password: password,
            role: UserType.PATRON,
            firstName: firstName,
            lastName: lastName
        }, {
            headers: {
                'content-type': 'application/json'
            }
        });
    }

    async requestNewActivationEmail(userName: string) {
        return axios.get(this.url + "auth/register/resend", {
            params: {
                'username': userName
            }
        })
    }

    async getUserDetails() {
        return axios.get(this.url + 'auth/user');
    }

    async logout() {
        return axios.post(this.url + 'auth/logout');
    }

    async getTotalNumberReportedBeers() {
        return axios.get(this.url + 'beer/count');
    }

    async getTotalNumberReportedVenues() {
        return axios.get(this.url + 'venue/count');
    }

    async getBeerVotedScore(beer: Beer) {
        return axios.get(this.url + `beer/vote/${beer.id}`);
    }

    async getUserFromPasswordResetToken(token: string) {
        return axios.get(this.url + `auth/user/passwordResetToken/${token}`);
    }

    async resetPassword(token: string, newPassword: string) {
        return axios.post(this.url + `auth/user/changePassword/${token}`, {
            newPassword: newPassword
        });
    }

    async resetPasswordUserLoggedIn(newPassword: string) {
        return axios.post(this.url + `auth/user/changePassword`, {
            newPassword: newPassword
        });
    }

    async requestResetPasswordEmail(usernameOrEmail: string) {
        return axios.post(`${this.url}auth/user/changePassword`, {}, {
            params: {
                username: usernameOrEmail
            }
        });
    }

    async updateHappyHour(venueId: number, daysOfWeek: string[], startTime: string, endTime: string) {
        return axios.post(`${this.url}venue/${venueId}/happyHour`, {
            daysOfWeek: daysOfWeek,
            startTime: startTime,
            endTime: endTime
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async updateBeer(beer: Beer) {
        return axios.put(`${this.url}beer`, JSON.stringify(beer), {
            headers: {
                'Content-Type' : 'application/json'
            }
        });
    }

    async getVenueById(id: string) {
        return axios.get(`${this.url}venue/${id}`, {
            headers: {
                'Accept' : 'application/json'
            }
        });
    }
}