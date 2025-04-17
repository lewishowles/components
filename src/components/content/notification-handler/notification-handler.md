# `notification-handler`

`notification-handler` displays and allows and end-user to manage notifications as provided by an app. Notifications are provided directly to the component, allowing the parent app to deal with what notifications to display and how notifications are marked as read depending on its requirements.

[More information about the process behind planning this component can be found in Notion](https://www.notion.so/lewishowles/Specification-Notification-handler-1b92b9e312118050bb76d8d9200d50a8)

## Slots

### `notification-read-template`

A general slot to allow custom designs for notifications marked as `{ read: true }` (where `hideNotificationsWhenRead` is `false`). The slot is provided with `{ notification, markNotificationRead }`, containing the details of the individual notification, and the ability to mark it as read (emit the appropriate event) through the standard procedure.

### `notification-unread-template`

A general slot to allow custom designs for notifications marked as `{ read: false }`. The slot is provided with `{ notification, markNotificationRead }`, containing the details of the individual notification, and the ability to mark it as read (emit the appropriate event) through the standard procedure.

### `notification-<type>-template`

A general slot to allow custom designs for notifications of a given `<type>` (one of `danger`, `warning`, and `info`). Takes precedence over the `notification-read` and `notification-unread` slots. The slot is provided with `{ notification, markNotificationRead }`, containing the details of the individual notification, and the ability to mark it as read (emit the appropriate event) through the standard procedure.

### `notification-pinned-template`

A general slot to allow custom designs for notifications that are `{ pinned: true }` . Takes precedence over the `notification-read`, `notification-unread` and `notification-<type>` slots. The slot is provided with `{ notification, markNotificationRead }`, containing the details of the individual notification, and the ability to mark it as read (emit the appropriate event) through the standard procedure.

### `notification-<id>-template`

A general slot to allow custom designs for notifications that are `{ pinned: true }` . Takes precedence over the `notification-read`, `notification-unread` and `notification-<type>` slots. The slot is provided with `{ notification, markNotificationRead }`, containing the details of the individual notification, and the ability to mark it as read (emit the appropriate event) through the standard procedure.

### `notification-actions`

A slot intended to allow actions to be added to individual notifications as required. The contents of this slot appear _after_ any "Mark as read" and "View more" actions. The slot is provided with a `{ notification }` containing the details of the individual notification.

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

### allowReload

- type: `Boolean`
- default: `true`

Whether to display the “Reload” button. Deactivating means new notifications will only be shown when something triggers a re-load in the parent component.

### allowMarkAllRead

- type: `Boolean`
- default: `true`

Whether to display the “Mark all read” button. Deactivating means the user will be required to mark notifications as read individually.

### loading

- type: `Boolean`
- default: `false`

Whether the notifications are currently loading (or re-loading). This will show a loading indicator to the user to provide feedback.

### hideNotificationsWhenRead

- type: `Boolean`
- default: `false`

Whether to hide notifications when they are marked as read. If false, notifications will remain, but will appear less prominent. If true, any notifications that are already read when initialised will not be shown.

### readNotificationCount

- type: `Number`
- default: `null`

The number of read notifications to display at maximum. Unread notifications are always shown.

## Events

### @notifications:read

- param: `notificationIds` _(string[])_

A list of one or more notification IDs which have been marked as read by the user.

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
