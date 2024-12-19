# `accordion-group`

`accordion-section` is a single section within an [`accordion-group`](/src/components/content/accordion-group/accordion-group.md)

## Slots

### `title`

The title of the section, which is used in the show / hide button.

### `introduction`

Any introduction to further explain the section's content. If used, this should be as short as possible.

### `default`

The content of the accordion section, which is shown when the section is visible.

### `show-section-label`

- default: The content of the `showSectionLabel` prop in the parent `accordion-group` ("Show this section").

The label to show this section.

### `hide-section-label`

- default: The content of the `hideSectionLabel` prop in the parent `accordion-group` ("Hide this section").

The label to hide this section.

## Props

### `titleClasses`

- type: `string`
- default: `null`

Any classes to apply to the section "title", which appears in the control button.

### `introductionClasses`

- type: `string`
- default: `null`

Any classes to apply to the section "introduction", which optionally appears in the control button.

## Examples

### Basic accordion

```html
<accordion-group>
	<accordion-section>
		<template #title>
			The Flux Capacitor
		</template>

		<template #introduction>
			The key to time travel.
		</template>

		<p>In the world of Back to the Future, the time circuits are the heart of the DeLorean's time-traveling capabilities. With a simple keypad interface, Doc Brown can input any date and time to travel to. The display shows the destination time, the present time, and the last departed time.</p>

		<p>It's a marvel of 1980s science fiction, giving Marty the ability to journey to the past, present, or future at the press of a button. The time circuits add an element of urgency and excitement, as every second counts when avoiding time paradoxes and ensuring the timeline remains intact.</p>
	</accordion-section>
	<accordion-section>
		<template #title>
			The DeLorean
		</template>

		<template #introduction>
			The iconic time-traveling machine.
		</template>

		...
	</accordion-section>
</accordion-group>
```
