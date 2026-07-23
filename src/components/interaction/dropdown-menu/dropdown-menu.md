# `dropdown-menu`

`dropdown-menu` provides an accessible action menu with a button trigger and keyboard navigation. Best used for menus with multiple action buttons; for example in `data-table` bulk actions or rows. Until the `lg` breakpoint, the contents of `dropdown-menu` are shown as a sheet.

For a simple summary-details or floating content area, use `summary-details` or `floating-details` instead.

To build up a standardised menu, use the companion components:

- `dropdown-menu-button`, a styled action button
- `dropdown-menu-link`, a styled link
- `dropdown-menu-divider`, a visual divider between sections
- `dropdown-menu-title`, a heading for grouped dropdown-menu items

## `dropdown-menu-title`

### Slots

#### default

Menu section title.

### Props

#### `headingLevel`

- type: `string`
- default: `h4`

The heading level to use for the dropdown menu title. Choose it based on the heading levels already used around this component; the library can't detect this automatically.

## Props

| Prop             | Type                        | Default   | Description                                                                                                                                                                                |
| ---------------- | --------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `buttonClasses`  | `string \| array \| object` | —         | Additional classes applied to the trigger button. Defaults to the standard muted button styling.                                                                                           |
| `detailsClasses` | `string \| array \| object` | `null`    | Additional classes applied to the menu panel, merged on top of the panel's base styles. Any provided classes that conflict with base classes will override as necessary.                   |
| `placement`      | `string`                    | `"below"` | Preferred placement: `"above"` or `"below"`. Flips automatically if the panel would clip the viewport. This prop does not affect placement or visibility in the narrow sheet presentation. |
| `align`          | `string`                    | `"start"` | Preferred alignment: `"start"` or `"end"`. Flips automatically if the panel would clip the viewport. This prop does not affect placement or visibility in the narrow sheet presentation.   |

## Slots

### `summary`

The trigger button content.

| Slot prop      | Type       | Description                                                                                                  |
| -------------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| `open`         | `boolean`  | Whether the menu is currently open.                                                                          |
| `openMenu`     | `function` | Open the menu programmatically.                                                                              |
| `closeMenu`    | `function` | Close the menu programmatically.                                                                             |
| `toggleMenu`   | `function` | Toggle the menu open or closed.                                                                              |
| `triggerProps` | `object`   | ARIA attributes (`aria-haspopup`, `aria-expanded`, `aria-controls`) to spread onto a custom trigger element. |

### `default`

The menu items, shown when open.

| Slot prop | Type      | Description                         |
| --------- | --------- | ----------------------------------- |
| `open`    | `boolean` | Whether the menu is currently open. |

## Events

### `@open`

Fired when the menu opens.

### `@close`

Fired when the menu closes.

## Methods

### `openMenu`

Open the menu programmatically.

### `closeMenu`

Close the menu programmatically.

## Keyboard behaviour

| Key                     | Action                                                                        |
| ----------------------- | ----------------------------------------------------------------------------- |
| `Enter` / `Space`       | Open the menu (on trigger)                                                    |
| `ArrowDown` / `ArrowUp` | Open the menu and focus first item (on trigger); move between items (in menu) |
| `Home`                  | Focus first item                                                              |
| `End`                   | Focus last item                                                               |
| Character keys          | Type-ahead: focus first item whose label starts with the typed text           |
| `Escape`                | Close menu, return focus to trigger                                           |
| `Tab`                   | Close menu, move focus to next element                                        |

## Styling hooks

| Attribute                        | Element        | Notes                          |
| -------------------------------- | -------------- | ------------------------------ |
| `data-component="dropdown-menu"` | Root element   | Scope styles to this component |
| `data-part="trigger"`            | Trigger button | —                              |
| `data-part="panel"`              | Floating panel | Only in DOM when open          |
| `data-state`                     | Root           | `"open"` or `"closed"`         |

## Examples

### Simple menu

```html
<dropdown-menu>
	<template #summary>Bulk actions</template>

	<dropdown-menu-button icon="icon-pencil">Edit</dropdown-menu-button>

	<dropdown-menu-button icon="icon-reload">Refresh</dropdown-menu-button>

	<dropdown-menu-divider />

	<dropdown-menu-button icon="icon-bin">Delete</dropdown-menu-button>
</dropdown-menu>
```
