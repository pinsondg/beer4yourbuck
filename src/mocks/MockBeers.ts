import {Beer} from "../model/Beer";

export const mockBudLight_untappedData: Beer = new Beer.Builder().withBeer({
    id: "1234",
    name: "Bud Light",
    breweryName: "Anheuser-Busch",
    abv: "4.2",
    volume: 12,
    price: 5,
    count: 1,
    isHappyHourDeal: false,
    untappedId: 3784,
    label: 'https://untappd.akamaized.net/site/beer_logos/beer-3784_0e2c3_sm.jpeg',
    beerType: 'Lager - American Light'
}).build();

export const mockBudLight_12Pack_untappedData: Beer = new Beer.Builder().withBeer({
    id: "1238",
    name: "Bud Light",
    breweryName: "Victory Brewing Company",
    abv: "4.2",
    volume: 12,
    price: 18.99,
    count: 12,
    untappedId: 3784,
    label: 'https://untappd.akamaized.net/site/beer_logos/beer-3784_0e2c3_sm.jpeg',
    beerType: 'Lager - American Light'
}).build();

export const mockBudweiser_untappedData: Beer = new Beer.Builder().withBeer({
    id: "1235",
    name: "Budweiser",
    breweryName: "Anheuser-Busch",
    abv: "5",
    volume: 12,
    price: 6,
    count: 1,
    isHappyHourDeal: false,
    untappedId: 3783,
    label: 'https://untappd.akamaized.net/site/beer_logos/beer-3783_b208c_sm.jpeg',
    beerType: 'Lager - American'
}).build();

export const mockBudLightLime_untappedData_isHappyHour: Beer = new Beer.Builder().withBeer({
    id: "1236",
    name: "Bud Light Lime",
    breweryName: "Anheuser-Busch",
    abv: "4.2",
    volume: 12,
    price: 6.5,
    count: 1,
    isHappyHourDeal: true,
    untappedId: 6341,
    label: 'https://untappd.akamaized.net/site/beer_logos/beer-3783_b208c_sm.jpeg',
    beerType: 'Lager - American Light'
}).build();

export const goldenMonkey_untappedData_isHappyHour: Beer = new Beer.Builder().withBeer({
    id: "1237",
    name: "Golden Monkey",
    breweryName: "Victory Brewing Company",
    abv: "9.5",
    volume: 12,
    price: 5,
    count: 1,
    isHappyHourDeal: true,
    untappedId: 3787,
    label: 'https://untappd.akamaized.net/site/beer_logos/beer-3787_20fc3_sm.jpeg',
    beerType: 'Pilsner'
}).build();

export const mockBudweiser_noUntappedData: Beer = new Beer.Builder().withBeer({
    id: '1238',
    name: "Budweiser",
    breweryName: "Anheuser-Busch",
    abv: "5",
    volume: 12,
    price: 6,
    count: 1,
    isHappyHourDeal: false,
}).build();