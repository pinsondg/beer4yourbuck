NotificationComponent Error example:

```js
import {NotificationType} from "../../context/NotificationContext";
const notification = {
    title: 'Example Error Notification',
    message: 'This is a test error notification.',
    type: NotificationType.ERROR,
};

<NotificationComponent notification={notification} onClose={() => alert("Close Clicked!")}/>
```

NotificationComponent Sucess example:

```js
import {NotificationType} from "../../context/NotificationContext";
const notification = {
    title: 'Example Success Notification',
    message: 'This is a test success notification.',
    type: NotificationType.SUCCESS,
};

<NotificationComponent notification={notification} onClose={() => alert("Close Clicked!")}/>
```

NotificationComponent Warn example:

```js
import {NotificationType} from "../../context/NotificationContext";
const notification = {
    title: 'Example Warning Notification',
    message: 'This is a test warning notification.',
    type: NotificationType.WARNING,
};

<NotificationComponent notification={notification} onClose={() => alert("Close Clicked!")}/>
```

NotificationComponent Info example:

```js
import {NotificationType} from "../../context/NotificationContext";
const notification = {
    title: 'Example Info Notification',
    message: 'This is a test info notification.',
    type: NotificationType.INFO,
};

<NotificationComponent notification={notification} onClose={() => alert("Close Clicked!")}/>
```