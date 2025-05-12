# `floating-details`

`floating-details` is an extension of `summary-details`, providing sensible defaults for a floating dropdown menu, such as that found in `notification-handler`.

## Slots

### `summary`

The content to be displayed in the summary.

#### Slot props

##### `open`

- type: `boolean`

Whether the details are currently visible.

##### `icon`

- type: `string`

The computed icon to display for the current state.

### `default`

The content to be displayed in the details element when open.

#### Slot props

##### `open`

- type: `boolean`

Whether the details are currently visible.

##### `icon`

- type: `string`

The computed icon to display for the current state.

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

### `align`

- type: `string`
- default: `end`

Whether to align to the dropdown to the start or end of the summary. This is useful for menus that open to the end of the screen, for example. Anything but "start" will be treated as "end".

### `summaryClasses`

- type: `string`
- default: `null`

Any classes to add to the summary element, allowing styling to wrap both the summary and icons.

### `detailsClasses`

- type: `string`
- default: `mt-3 rounded-md border border-grey-200 bg-white p-4 shadow`

Any classes to add to the details content wrapper.

### `detailsSizeClasses`

- type: `string`
- default: `max-w-lg`

Any classes to add to specify the details content's size. This is separate to details classes so that the appearance can be consistent even if the size is not.

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
<floating-details>
	<template #summary>
		Summary content
	</template>

	Details content
</floating-details>
```

### With a single icon

```html
<floating-details v-bind="{ icon: 'icon-user' }">
	<template #summary>
		Summary content
	</template>

	Details content
</floating-details>
```
