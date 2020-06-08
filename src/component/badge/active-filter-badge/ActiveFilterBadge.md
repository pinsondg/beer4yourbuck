ActiveFilterBadge example:

```js
import FilterType from '../../../model/Filter';
<ActiveFilterBadge 
    filterId={1}
    filter={{type: FilterType.BEER_TYPE, displayValue: "Test Filter", value: 10}}
    onRemove={(id) => alert("Removing " + id)}
    canRemove={true}
/>
```