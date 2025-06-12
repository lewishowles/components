# `accordion-group`

`accordion-group` represents an accordion and is used in conjunction with [`accordion-panel`](/src/components/content/accordion-panel/accordion-panel.md), which represents each panel in the group, to create a set of accessible content.

Accordions are very much like tabs, but display content vertically. Accordions provide a few benefits, one of which is that there isn't really a physical limit to the number of accordion panels, as they’re displayed vertically. To that point, accordion buttons can also have more text explaining their purpose—though this should be kept to an absolute minimum.

Another advantage is that multiple (or all) panels can be displayed at once.

Accordions should only really be used with content, however, and should not be used to hide panels of a form. If this is the case, it is likely that the form is too complex and should be split over multiple pages. If a user needs to compare two panels or change between them regularly, tabs are a better choice as content does’t move.

If only one panel is needed, to provide further context, for example, use the “Details” element instead.

## Slots

### `default`

The `default` slot contains the `accordion-panel` components that represent the content.

### `show-all-panels-label`

- default: "Show all panels"

The label for the button which shows all accordion panels.

### `hide-all-panels-label`

- default: "Hide all panels"

The label for the button which hides all accordion panels.

### `show-panel-label`

- default: "Show panel"

The label for the individual panel buttons to show that panel.

### `hide-panel-label`

- default: "Hide panel"

The label for the individual panel buttons to hide that panel.

## Props

### `headingLevel`

- type: `string`
- default: `h2`

The heading level to use for all panels.

## Examples

### Basic accordion

```html
<accordion-group>
	<accordion-panel>
		<template #title>
			The Flux Capacitor
		</template>

		<template #introduction>
			The key to time travel.
		</template>

		<p>In the world of Back to the Future, the time circuits are the heart of the DeLorean's time-travelling capabilities. With a simple keypad interface, Doc Brown can input any date and time to travel to. The display shows the destination time, the present time, and the last departed time.</p>

		<p>It's a marvel of 1980s science fiction, giving Marty the ability to journey to the past, present, or future at the press of a button. The time circuits add an element of urgency and excitement, as every second counts when avoiding time paradoxes and ensuring the timeline remains intact.</p>
	</accordion-panel>
	<accordion-panel>
		<template #title>
			The DeLorean
		</template>

		<template #introduction>
			The iconic time-traveling machine.
		</template>

		...
	</accordion-panel>
</accordion-group>
```
