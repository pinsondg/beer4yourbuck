CollapseWithScrollMenu example:

```js
import {useRef} from "react";
const scrollRef  = useRef(null);
<div style={{display: 'flex', flexDirection: 'column', overflow: 'hidden', maxHeight: '150px'}}>
    <CollapseWithScrollMenu scrollRef={scrollRef}>
        <div style={{border: '1px solid red'}}>Collapsing<br/>Collapsing</div>
    </CollapseWithScrollMenu>
    <div ref={scrollRef} style={{overflowY: 'scroll', border: '1px solid blue'}}>
        Scrollable Content
        <br/>
        Scrollable Content
        <br/>
        Scrollable Content
        <br/>
        Scrollable Content
        <br/>
        Scrollable Content
        <br/>
        Scrollable Content
        <br/>
        Scrollable Content
        <br/>
        Scrollable Content
        <br/>
        Scrollable Content
    </div>
</div>
```