# `floating-details`

`floating-details` is an extension of `summary-details`, providing sensible defaults for a floating dropdown menu, such as that found in `notification-handler`.

## Slots

### `summary`

The content to be displayed in the summary.

| Slot prop | Type       | Description                              |
| --------- | ---------- | ---------------------------------------- |
| `isOpen`  | `boolean`  | Whether the panel is currently visible.  |
| `icon`    | `string`   | The computed icon for the current state. |
| `open`    | `function` | Opens the panel.                         |
| `close`   | `function` | Closes the panel.                        |
| `toggle`  | `function` | Toggles the panel open or closed.        |

### `default`

The content to be displayed when the panel is open.

| Slot prop | Type       | Description                              |
| --------- | ---------- | ---------------------------------------- |
| `isOpen`  | `boolean`  | Whether the panel is currently visible.  |
| `icon`    | `string`   | The computed icon for the current state. |
| `open`    | `function` | Opens the panel.                         |
| `close`   | `function` | Closes the panel.                        |
| `toggle`  | `function` | Toggles the panel open or closed.        |

## Props

### `open`

- type: `boolean`
- default: `false`

Whether the details element should initially be open.

### `closeWithEscape`

- type: `boolean`
- default: `true`

Whether to close the details element when pressing escape. If focus is within this component, focus is moved to the summary element.

### `closeWithClickOutside`

- type: `boolean`
- default: `true`

Whether to close the details element when clicking outside of the component.

### `iconOpen`

- type: `string`
- default: `icon-chevron-up`

The icon to display when the details are open.

### `iconClosed`

- type: `string`
- default: `icon-chevron-down`

The icon to display when the details are closed.

### `icon`

- type: `string`
- default: `null`

An override icon, shown both when details are open and closed.

### `iconStart`

- type: `boolean`
- default: `false`

Whether to display the icon at the start of the summary, as opposed to the end.

### `includeIcon`

- type: `boolean`
- default: `true`

Whether to include a summary icon at all. This allows more flexibility with the styling of the summary, but it is important to make it clear to the user what is happening.

### `iconOnly`

- type: `boolean`
- default: `false`

Whether to only include a summary icon, hiding any provided text. When used, text should still be provided to assist screen reader users.

### `align`

- type: `string`
- default: `start`

The preferred panel alignment: `start` aligns the panel's leading edge with the trigger's, `end` aligns the trailing edges. The panel flips to the opposite side if it would clip the viewport edge.

### `placement`

- type: `string`
- default: `below`

The preferred panel placement: `below` opens beneath the trigger, `above` opens above it. The panel flips to the opposite side if it would clip the viewport edge.

### `summaryClasses`

- type: `Vue class binding`
- default: `null`

Any classes to add to the summary element, allowing styling to wrap both the summary and icons.

### `detailsClasses`

- type: `Vue class binding`
- default: `mt-3 rounded-md border border-grey-200 bg-white p-4 shadow`

Any classes to add to the details content wrapper.

### detailsColourClasses

- type: `Vue class binding`
- default: `mt-3 rounded-md border border-grey-200 bg-white p-4 shadow`

Any colours to apply to the details. These are passed as additional classes, but are separate so that colours can be redefined without affecting remaining styling.

### `detailsSizeClasses`

- type: `Vue class binding`
- default: `max-w-lg`

Any classes to add to specify the details content's size. This is separate to details classes so that the appearance can be consistent even if the size is not.

### detailsAdditionalClasses

- type: `Vue class binding`
- default: `null`

Any classes to add that don't fit into other categories. This is so that existing classes do not have to be reproduced.

### `iconClasses`

- type: `Vue class binding`
- default: `null`

Any classes to add to the icon itself. Particularly useful if the icon is the only visible summary element.

## Events

### `@open`

Fired when the details element is opened.

### `@close`

Fired when the details element is closed.

## Methods

### `openDetails`

Open the details.

### `closeDetails`

Close the details.

## Examples

### Basic summary details

```html
<floating-details>
	<template #summary> Summary content </template>

	Details content
</floating-details>
```

### With a single icon

```html
<floating-details v-bind="{ icon: 'icon-user' }">
	<template #summary> Summary content </template>

	Details content
</floating-details>
```
