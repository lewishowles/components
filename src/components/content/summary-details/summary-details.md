# `summary-details`

Provides an implementation of the `details` element with optional extras, such as custom icons, and allows a simple way of having content that can be toggled. Suitable for items such as FAQs or even dropdown menus.

## Slots

### `summary`

The content to be displayed in the summary.

| Slot prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Whether the details are currently visible. |
| `icon` | `string` | The computed icon to display for the current state. |

### `default`

The content to be displayed in the details element when open.

| Slot prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Whether the details are currently visible. |
| `icon` | `string` | The computed icon to display for the current state. |

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
- default: `false`

Whether to close the details element when clicking outside of the component. This is best combined with `floating` for menus.

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

### `iconAtStart`

- type: `boolean`
- default: `false`

Whether to display the icon at the start of the summary, as opposed to the end.

### `includeIcon`

- type: `boolean`
- default: `true`

Whether to include a summary icon at all. This allows more flexibility with the styling of the summary, but it is important to make it clear to the user what is happening.

### `floating`

- type: `boolean`
- default: `false`

Whether the details should float when opened, perfect for drop down menus.

### `align`

- type: `string`
- default: `start`

When floating, whether to align to the dropdown to the start or end of the summary. This is useful for menus that open to the end of the screen, for example. Anything but "start" will be treated as "end".

### `summaryClasses`

- type: `string`
- default: `null`

Any classes to add to the summary element, allowing styling to wrap both the summary and icons.

### `detailsClasses`

- type: `string`
- default: `null`

Any classes to add to the details content wrapper.

### `iconClasses`

- type: `string`
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
<summary-details>
	<template #summary>
		Summary content
	</template>

	Details content
</summary-details>
```

### With a single icon

```html
<summary-details v-bind="{ icon: 'icon-user' }">
	<template #summary>
		Summary content
	</template>

	Details content
</summary-details>
```
