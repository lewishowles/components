# `accordion-group`

`accordion-group` represents an accordion and is used in conjunction with [`accordion-section`](/src/components/content/accordion-section/accordion-section.md), which represents each section in the group, to create a set of accessible content.

Accordions are very much like tabs, but display content vertically. Accordions provide a few benefits, one of which is that there can be more accordions than there are tabs, as they’re displayed vertically. To that point, accordion buttons can also have more text explaining their purpose—though this should be kept to an absolute minimum.

Another advantage is that multiple (or all) sections can be displayed at once.

Accordions should only really be used with content, however, and should not be used to hide sections of a form. If this is the case, it is likely that the form is too complex and should be split over multiple pages. If a user needs to compare two sections or change between them regularly, tabs are a better choice as content does’t move.

If only one section is needed, to provide further context, for example, use the “Details” element instead.

## Slots

### `default`

The `default` slot contains the `accordion-section` components that represent the tabs.

### `show-all-sections-label`

- default: "Show all sections"

The label for the button which shows all accordion sections.

### `hide-all-sections-label`

- default: "Hide all sections"

The label for the button which hides all accordion sections.

## Props

### `headingLevel`

- type: `string`
- default: `h2`

The heading level to use for all sections.

### `showSectionLabel`

- type: `string`
- default: `Show this section`

The label to show an individual section. This is a prop because it is provided to each section by the group. This can also be set per-section via the `show-section-label` slot.

### `hideSectionLabel`

- type: `string`
- default: `Hide this section`

The label to hide an individual section. This is a prop because it is provided to each section by the group. This can also be set per-section via the `hide-section-label` slot.

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
