BeerNearYouBrick example:

```js
import {Beer} from '../../../model/Beer'
import 'bootstrap/dist/css/bootstrap.css';
const beer = new Beer.Builder().withBeer({
    name: 'Bud Light',
    volume: 12,
    abv: 4.6,
    price: 3.50,
    verified: false
}).build();
const venue = {
    name: 'PBR',
    beers: [beer],
    lat: 12.4,
    lon: 12.7,
    address: '2553 W Cary St, Richmond, VA 23220',
    venueTypes: ['RESTAURANT']
};
<BeerNearYouBrick beer={beer} venue={venue}/>
```