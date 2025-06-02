# `dropdown-menu`

`dropdown-menu` is an extension of a floating `summary-details`, providing a quick and easy way to create dropdown or action menus. From actions in tables to bulk item management, dropdown menus provide an easy, accessible way to de-clutter an interface, but should not be used where very common actions would be hidden and more difficult to access for the sake of cleanliness.

To simplify the creation of a standardised menu, there are a number of companion components that can be used to build up a menu, including:

- `dropdown-menu-button`, a styled extension of `ui-button`
- `dropdown-menu-link`, a styled extension of `link-tag`
- `dropdown-menu-divider`, a thematically appropriate divider between menu sections

## Slots

### `summary`

The content to be displayed in the summary.

| Slot prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Whether the details are currently visible. |
| `icon` | `string` | The computed icon to display for the current state. |

### `default`

The content to be displayed in the menu when open.

| Slot prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Whether the details are currently visible. |
| `icon` | `string` | The computed icon to display for the current state. |

## Props

### `open`

- type: `boolean`
- default: `false`

Whether the menu should initially be open.

### `closeWithEscape`

- type: `boolean`
- default: `true`

Whether to close the menu when pressing escape. If focus is within this component, focus is moved to the summary element.

### `closeWithClickOutside`

- type: `boolean`
- default: `true`

Whether to close the menu when clicking outside of the component. This is best combined with `floating` for menus.

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

Fired when the menu is opened.

### `@close`

Fired when the menu is closed.

## Methods

### `openMenu`

Open the menu.

### `closeMenu`

Close the menu.

## Examples

### Simple menu

```html
<dropdown-menu>
	<template #summary>
		Bulk actions
	</template>

	<dropdown-menu-button icon="icon-pencil">
		Edit
	</dropdown-menu-button>

	<dropdown-menu-button icon="icon-reload">
		Refresh
	</dropdown-menu-button>

	<dropdown-menu-divider />

	<dropdown-menu-button icon="icon-bin">
		Delete
	</dropdown-menu-button>
</dropdown-menu>
```
