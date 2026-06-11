# `notification-handler`

`notification-handler` displays and allows an end-user to manage notifications. Notification data is managed via the `useNotifications()` composable, which provides a module-scoped registry shared across the application.

## `useNotifications()`

The composable is the primary API for working with notifications. Import it anywhere in the application to add, remove, or update notifications.

```js
import { useNotifications } from "@lewishowles/components/composables";

const { add, remove, markRead, markAllRead, clear } = useNotifications();
```

### `add(notification)`

Add a notification to the registry. `message` is required; all other fields are optional.

| Field       | Type       | Required | Purpose                                                                                                                                                                                     |
| ----------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string`   | No       | Unique identifier. Auto-generated if not provided.                                                                                                                                          |
| `message`   | `string`   | Yes      | The content of the notification.                                                                                                                                                            |
| `title`     | `string`   | No       | A title to display with the notification.                                                                                                                                                   |
| `type`      | `string`   | No       | One of `danger`, `warning`, or `info`. Defaults to `info`.                                                                                                                                  |
| `date`      | `string`   | No       | The date the notification was issued (`YYYY-MM-DD`). If included, a formatted date is displayed using [`display-date`](/src/components/content/display-date/display-date.md).               |
| `url`       | `string`   | No       | Any URL at which the user can get more information. Clicking the notification will open the URL in a new tab.                                                                               |
| `read`      | `boolean`  | No       | Whether the message has been read. Defaults to `false`.                                                                                                                                     |
| `pinned`    | `boolean`  | No       | Whether this notification should be pinned to the top of the list. Pinned notifications cannot be marked as read, and will appear regardless of read status or `hideNotificationsWhenRead`. |
| `image_url` | `string`   | No       | The URL to any image to display beside the notification. Takes precedence over `icon`.                                                                                                      |
| `icon`      | `string`   | No       | Any icon component to display beside the notification, e.g. `icon-help`.                                                                                                                    |
| `onRead`    | `function` | No       | Called when the notification is marked as read. Useful for backend sync.                                                                                                                    |
| `onRemove`  | `function` | No       | Called when the notification is removed. Useful for backend sync.                                                                                                                           |

### `remove(id)`

Remove a notification by ID. Calls the notification's `onRemove` callback if registered.

### `markRead(id)`

Mark a single notification as read by ID. Calls the notification's `onRead` callback if registered.

### `markAllRead()`

Mark all non-pinned, unread notifications as read. Calls each `onRead` callback if registered.

### `clear()`

Remove all notifications from the registry.

## Slots

### `notification-read-template`

A general slot to allow custom designs for notifications marked as `{ read: true }` (where `hideNotificationsWhenRead` is `false`).

| Slot prop      | Type     | Description                                            |
| -------------- | -------- | ------------------------------------------------------ |
| `notification` | `object` | The notification details, as provided to the component |

### `notification-unread-template`

A general slot to allow custom designs for notifications marked as `{ read: false }`.

| Slot prop              | Type     | Description                                                                   |
| ---------------------- | -------- | ----------------------------------------------------------------------------- |
| `notification`         | `object` | The notification details, as provided to the component                        |
| `markNotificationRead` | function | Mark the notification read, as if the user had pressed the "Mark read" button |

### `notification-<type>-template`

A general slot to allow custom designs for notifications of a given `<type>` (one of `danger`, `warning`, and `info`). Takes precedence over the `notification-read` and `notification-unread` slots.

| Slot prop              | Type     | Description                                                                   |
| ---------------------- | -------- | ----------------------------------------------------------------------------- |
| `notification`         | `object` | The notification details, as provided to the component                        |
| `markNotificationRead` | function | Mark the notification read, as if the user had pressed the "Mark read" button |

### `notification-pinned-template`

A general slot to allow custom designs for notifications that are `{ pinned: true }`. Takes precedence over the `notification-read`, `notification-unread` and `notification-<type>` slots.

| Slot prop              | Type     | Description                                                                   |
| ---------------------- | -------- | ----------------------------------------------------------------------------- |
| `notification`         | `object` | The notification details, as provided to the component                        |
| `markNotificationRead` | function | Mark the notification read, as if the user had pressed the "Mark read" button |

### `notification-<id>-template`

A general slot to allow a custom design for a notification with a specific ID. Takes precedence over all other notification slots.

| Slot prop              | Type     | Description                                                                   |
| ---------------------- | -------- | ----------------------------------------------------------------------------- |
| `notification`         | `object` | The notification details, as provided to the component                        |
| `markNotificationRead` | function | Mark the notification read, as if the user had pressed the "Mark read" button |

### `notification-actions`

A slot intended to allow actions to be added to individual notifications as required. The contents of this slot appear _after_ any "Mark as read" and "View more" actions.

| Slot prop      | Type     | Description                                            |
| -------------- | -------- | ------------------------------------------------------ |
| `notification` | `object` | The notification details, as provided to the component |

### `show-notifications-label`

Default: `Show notifications` / `Show notifications, {{ unreadCount }} unread`

The label for the button that opens the notifications panel. This label is hidden from view but required for accessibility.

| Slot prop     | Type     | Description                         |
| ------------- | -------- | ----------------------------------- |
| `unreadCount` | `number` | The number of unread notifications. |

A `role="status" aria-live="polite"` region is present in the DOM at all times. It announces when new unread notifications arrive and when all notifications are marked as read.

### `no-notifications-label`

Default: `No new notifications`

The text to show when no notifications are being displayed.

### `mark-all-read-label`

Default: `Mark all notifications read`

The label to use for the button that marks all unread notifications read.

### `reload-label`

Default: `Reload notifications`

The label to use for the button that attempts to re-load notifications.

### `loading-label`

Default: `Loading notifications`

The label to use when the loading indicator is shown.

### `mark-read-label`

Default: `Mark read`

The label to use for the button that marks an individual notification as read.

### `view-more-label`

Default: `View more`

The label to use for the button the link to view more information, if a notification has an associated URL.

## Props

### `locale`

- type: `string`
- default: `null`

The locale to use when displaying dates. To reset to the user's locale settings, set the locale to undefined.

### `dateFormat`

- type: `object`
- default: `{ year: "numeric", day: "numeric", month: "long" }`

The date format to use in the display of the date. To reset to the user's locale settings, set the format to null.

### `align`

- type: `string`
- default: `end`

The alignment of the pop up notifications panel. Anything but `start` will be treated as `end`.

### `allowMarkAllRead`

- type: `Boolean`
- default: `true`

Whether to display the "Mark all read" button. Deactivating means the user will be required to mark notifications as read individually.

### `allowReload`

- type: `Boolean`
- default: `true`

Whether to display the "Reload" button. Deactivating means new notifications will only be shown when something triggers a re-load in the parent component.

### `loading`

- type: `Boolean`
- default: `false`

Whether the notifications are currently loading (or re-loading). This will show a loading indicator to the user to provide feedback.

### `hideNotificationsWhenRead`

- type: `Boolean`
- default: `false`

Whether to hide notifications when they are marked as read. If false, notifications will remain, but will appear less prominent. If true, any notifications that are already read when initialised will not be shown.

### `readNotificationCount`

- type: `Number`
- default: `null`

The number of read notifications to display at maximum. Unread notifications are always shown.

## Events

### @notifications:reload

The user has requested that the notifications be reloaded. A loading indicator is not automatically shown to the user, to allow for the consuming component to better control the interaction, and should be displayed via the loading prop.

## Expose

When accessed via a template ref, the following are available:

| Property        | Type       | Description                                                   |
| --------------- | ---------- | ------------------------------------------------------------- |
| `notifications` | `object[]` | The filtered list of notifications currently being displayed. |
| `unreadCount`   | `number`   | The number of unread notifications.                           |
| `markAllRead`   | `function` | Mark all unread notifications as read.                        |

## Styling hooks

| Attribute                               | Element            | Notes                          |
| --------------------------------------- | ------------------ | ------------------------------ |
| `data-component="notification-handler"` | Root element       | Scope styles to this component |
| `data-part="list"`                      | Notifications list | —                              |

## Examples

### Basic usage

```js
import { useNotifications } from "@lewishowles/components/composables";

const { add, clear } = useNotifications();

// Populate on app startup (e.g. from an API response):
add({
	id: "abc-123",
	type: "info",
	title: "Your document is ready",
	message: "Property Portfolio, XH1530 is now ready to view.",
	date: "2025-03-22",
	onRead: () => api.markRead("abc-123"),
});
```

```html
<notification-handler />
```

### Overriding the display of a particular type

```html
<notification-handler>
	<template #notification-danger-template="{ notification }">
		This is a danger notification, with message {{ notification.message }}
	</template>
</notification-handler>
```
