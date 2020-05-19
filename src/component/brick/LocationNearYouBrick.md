LocationNearYouBrick example:

```js
import 'bootstrap/dist/css/bootstrap.css';
import {Beer} from '../../model/Beer';

const beer1 = new Beer.Builder().withBeer({
    name: 'Bud Light',
    volume: 12,
    abv: 4.6,
    price: 3.50,
    verified: false
}).build();
const venue = {
    name: 'PBR',
    beers: [beer1],
    lat: 12.4,
    lon: 12.7,
    address: '2553 W Cary St, Richmond, VA 23220',
    venueTypes: ['RESTAURANT']
};
<LocationNearYouBrick distance={100} venue={venue} />
```