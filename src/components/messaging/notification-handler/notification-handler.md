# `notification-handler`

`notification-handler` displays and allows and end-user to manage notifications as provided by an app. Notifications are provided directly to the component, allowing the parent app to deal with what notifications to display and how notifications are marked as read depending on its requirements.

[More information about the process behind planning this component can be found in Notion](https://www.notion.so/lewishowles/Specification-Notification-handler-1b92b9e312118050bb76d8d9200d50a8)

## Slots

### `notification-read-template`

A general slot to allow custom designs for notifications marked as `{ read: true }` (where `hideNotificationsWhenRead` is `false`).

| Slot prop | Type | Description |
|-|-|-|
| `notification` | `object` | The notification details, as provided to the component |

### `notification-unread-template`

A general slot to allow custom designs for notifications marked as `{ read: false }`.

| Slot prop | Type | Description |
|-|-|-|
| `notification` | `object` | The notification details, as provided to the component |
| `markNotificationRead` | function | Mark the notification read, as if the user had pressed the "Mark read" button |

### `notification-<type>-template`

A general slot to allow custom designs for notifications of a given `<type>` (one of `danger`, `warning`, and `info`). Takes precedence over the `notification-read` and `notification-unread` slots.

| Slot prop | Type | Description |
|-|-|-|
| `notification` | `object` | The notification details, as provided to the component |
| `markNotificationRead` | function | Mark the notification read, as if the user had pressed the "Mark read" button |

### `notification-pinned-template`

A general slot to allow custom designs for notifications that are `{ pinned: true }` . Takes precedence over the `notification-read`, `notification-unread` and `notification-<type>` slots.

| Slot prop | Type | Description |
|-|-|-|
| `notification` | `object` | The notification details, as provided to the component |
| `markNotificationRead` | function | Mark the notification read, as if the user had pressed the "Mark read" button |

### `notification-<id>-template`

A general slot to allow custom designs for notifications that are `{ pinned: true }` . Takes precedence over the `notification-read`, `notification-unread` and `notification-<type>` slots.

| Slot prop | Type | Description |
|-|-|-|
| `notification` | `object` | The notification details, as provided to the component |
| `markNotificationRead` | function | Mark the notification read, as if the user had pressed the "Mark read" button |

### `notification-actions`

A slot intended to allow actions to be added to individual notifications as required. The contents of this slot appear _after_ any "Mark as read" and "View more" actions.

| Slot prop | Type | Description |
|-|-|-|
| `notification` | `object` | The notification details, as provided to the component |

### `show-notifications-label`

Default: `Show notifications`

The label to use for the button that opens the notifications panel. This label is hidden from view, but is required for accessibility purposes.

### `no-notifications-label`

Default: `No new notifications`

The text to show when no notifications are being displayed, either because none were provided, none were viable, or all notification have been marked as read and should not be shown.

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

### `notifications`

- type: `Object[]`
- default: `null`

The notifications to display to the user.

| Field         | Type      | Required | Purpose                                                                                                                                                                                                 |
|---------------|-----------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`          | `string`  | Yes      | Used to identify individual notifications, which can be used when emitting events for a notification being marked as read, for example.                                                                 |
| `title`       | `string`  | No       | A title to display with the notification.                                                                                                                                                               |
| `message`     | `string`  | Yes      | The content of the notification. Any notification without a message will not be displayed.                                                                                                              |
| `type`        | `string`  | No       | The type of notification, one of `danger`, `warning`, or `info`. Defaults to `info`.                                                                                                                    |
| `date`        | `string`  | No       | The date the notification was issued (`YYYY-MM-DD`). If included, a formatted date is displayed to the user using [`display-date`](/src/components/content/display-date/display-date.md).               |
| `url`         | `string`  | No       | Any URL at which the user can get more information about this notification. Clicking on the notification will open the URL in a new tab.                                                                |
| `read`        | `boolean` | No       | Whether the message has been read. If not provided, we will assume the message has been read (as a safe fallback that doesn’t consistently re-introduce the same notifications).                        |
| `pinned`      | `boolean` | No       | Whether this notification should be pinned to the top of the list. Pinned notifications cannot be marked as read, and will appear each time regardless of read status or `hideNotificationsWhenRead`.   |
| `image_url`   | `string`  | No       | The URL to any image to display beside the notification. If both `image_url` and `icon` are defined, `image_url` takes precedence.                                                                      |
| `icon`        | `string`  | No       | Any icon component to display beside the notification, e.g. `icon-help`. If both `image_url` and `icon` are defined, `image_url` takes precedence.                                                      |

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

Whether to display the “Mark all read” button. Deactivating means the user will be required to mark notifications as read individually.

### `allowReload`

- type: `Boolean`
- default: `true`

Whether to display the “Reload” button. Deactivating means new notifications will only be shown when something triggers a re-load in the parent component.

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

### @notifications:read

Called when one (or all via "Mark all notifications read") notifications are marked as read.

| Param | Type | Description |
|-|-|-|
| `notificationIds` | `string[]` | A list of one or more notification IDs which have been marked as read by the user. |

### @notifications:reload

The user has requested that the notifications be reloaded. A loading indicator is not automatically shown to the user, to allow for the consuming component to better control the interaction, and should be displayed via the loading prop.

## Examples

### Basic notifications

```html
<notification-handler v-bind="{ notifications }" />
```

### Overriding the display of a particular type

```html
<notification-handler v-bind="{ notifications }">
	<template #notification-danger-template="{ notification }">
		This is a danger notification, with message {{ notification.message }}
	</template>
</notification-handler>
```
