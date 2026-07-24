# `summary-details`

Provides an implementation of the `details` element with optional extras, such as custom icons, and allows a simple way of having content that can be toggled. Suitable for items such as FAQs. Use `floating-details` when the toggled content needs to appear as a floating panel, such as a dropdown menu.

When closed, the content is hidden using `hidden="until-found"`, making it discoverable by find-in-page searches. When the user finds text within a closed `summary-details`, the component is automatically kept in sync.

## Slots

### `summary`

The content to be displayed in the summary.

| Slot prop | Type       | Description                                         |
| --------- | ---------- | --------------------------------------------------- |
| `isOpen`  | `boolean`  | Whether the details are currently visible.          |
| `icon`    | `string`   | The computed icon to display for the current state. |
| `open`    | `function` | Opens the details.                                  |
| `close`   | `function` | Closes the details.                                 |
| `toggle`  | `function` | Toggles the details between open and closed.        |

### `default`

The content to be displayed in the details element when open.

| Slot prop | Type       | Description                                         |
| --------- | ---------- | --------------------------------------------------- |
| `isOpen`  | `boolean`  | Whether the details are currently visible.          |
| `icon`    | `string`   | The computed icon to display for the current state. |
| `open`    | `function` | Opens the details.                                  |
| `close`   | `function` | Closes the details.                                 |
| `toggle`  | `function` | Toggles the details between open and closed.        |

## Props

### `open`

- type: `boolean`
- default: `false`

Whether the details element should initially be open.

### `autofocus`

- type: `boolean`
- default: `false`

Whether to focus the first focusable element in the content area when the details are opened. Useful when the content contains a form or an action the user is expected to interact with immediately.

### `toggletip`

- type: `boolean`
- default: `false`

Whether to announce concise, non-interactive information immediately when opened. Use this for supplementary content rather than essential help, and do not use it as a general-purpose tooltip pattern for links, rich interactive content, or definitions within a paragraph. Use a visible description, `floating-details`, or `modal-dialog` when the content needs to be persistently available or interacted with.

### `closeWithEscape`

- type: `boolean`
- default: `true`

Whether to close the details element when pressing escape. If focus is within this component, focus is moved to the summary element.

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

### `iconOnly`

- type: `boolean`
- default: `false`

Whether to only include a summary icon, hiding any provided text. When used, text should still be provided to assist screen reader users.

### `summaryClasses`

- type: `Vue class binding`
- default: `null`

Any classes to add to the summary element, allowing styling to wrap both the summary and icons.

### `detailsClasses`

- type: `Vue class binding`
- default: `null`

Any classes to add to the details content wrapper.

### `iconClasses`

- type: `Vue class binding`
- default: `null`

Additional classes to apply to the summary icon, merged on top of the base size (`size-[0.857em]`). Any provided classes that conflict with base classes will override as necessary.

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

### `toggleDetails`

Toggle the details between open and closed.

## Styling hooks

| Attribute                          | Element         | Notes                                            |
| ---------------------------------- | --------------- | ------------------------------------------------ |
| `data-component="summary-details"` | Root            | Scope styles to this component                   |
| `data-part="summary"`              | Summary trigger | The `<summary>` element that toggles the details |
| `data-part="content"`              | Content region  | The region revealed when the details are open    |
| `data-state`                       | Root            | `"open"` or `"closed"`                           |

## Examples

### Basic summary details

```html
<summary-details>
	<template #summary>Summary content</template>

	Details content
</summary-details>
```

### With a single icon

```html
<summary-details v-bind="{ icon: 'icon-user' }">
	<template #summary>Summary content</template>

	Details content
</summary-details>
```
