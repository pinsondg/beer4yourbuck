TimeChooseModal example:

```js
import {useState} from "react";
const [show, setShow] = useState(false);
<div>
    <button onClick={() => setShow(true)}>Show Time Choose Modal</button>
    <TimeChooseModal show={show} onClose={() => setShow(false)}/>
</div>
```
