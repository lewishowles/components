# `accordion-panel`

`accordion-panel` is a single panel within an [`accordion-group`](/src/components/content/accordion-group/accordion-group.md)

When 6 or fewer panels are present, the panel content is wrapped in `role="region"` with `aria-labelledby` pointing to the panel title. This makes each panel a named landmark, allowing screen reader users to jump directly to panel content. When more than 6 panels are present the region role is omitted to avoid cluttering the landmark list.

## Slots

### `title`

The title of the panel, which is used in the show / hide button.

### `introduction`

Any introduction to further explain the panel's content. If used, this should be as short as possible.

### `default`

The content of the accordion panel, which is shown when the panel is visible.

| Prop     | Type      | Description                           |
| -------- | --------- | ------------------------------------- |
| `isOpen` | `boolean` | Whether this panel is currently open. |

### `show-panel-label`

- default: The content of the `show-panel-label` slot in the parent `accordion-group` ("Show panel").

The label to show this panel. Overrides the `show-panel-label` slot in the parent `accordion-group`.

| Prop     | Type       | Description                           |
| -------- | ---------- | ------------------------------------- |
| `isOpen` | `boolean`  | Whether this panel is currently open. |
| `toggle` | `function` | Toggle the open state of this panel.  |

### `hide-panel-label`

- default: The content of the `hide-panel-label` slot in the parent `accordion-group` ("Hide panel").

The label to hide this panel. Overrides the `hide-panel-label` slot in the parent `accordion-group`.

| Prop     | Type       | Description                           |
| -------- | ---------- | ------------------------------------- |
| `isOpen` | `boolean`  | Whether this panel is currently open. |
| `toggle` | `function` | Toggle the open state of this panel.  |

## Styling hooks

| Attribute                          | Element          | Notes                          |
| ---------------------------------- | ---------------- | ------------------------------ |
| `data-component="accordion-panel"` | Root             | Scope styles to this component |
| `data-part="trigger"`              | Show/hide button | —                              |
| `data-part="content"`              | Content region   | —                              |
| `data-state`                       | Root             | `"open"` or `"closed"`         |

## Examples

### Basic accordion

```html
<accordion-group>
	<accordion-panel>
		<template #title>The Flux Capacitor</template>

		<template #introduction>The key to time travel.</template>

		<p>
			In the world of Back to the Future, the time circuits are the heart of the DeLorean's
			time-traveling capabilities. With a simple keypad interface, Doc Brown can input any date and
			time to travel to. The display shows the destination time, the present time, and the last
			departed time.
		</p>

		<p>
			It's a marvel of 1980s science fiction, giving Marty the ability to journey to the past,
			present, or future at the press of a button. The time circuits add an element of urgency and
			excitement, as every second counts when avoiding time paradoxes and ensuring the timeline
			remains intact.
		</p>
	</accordion-panel>
	<accordion-panel>
		<template #title>The DeLorean</template>

		<template #introduction>The iconic time-traveling machine.</template>

		...
	</accordion-panel>
</accordion-group>
```
