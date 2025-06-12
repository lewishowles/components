<template>
	<component-page>
		<template #title>
			Accordion group
		</template>

		<template #introduction>
			<p><code>accordion-group</code> represents an accordion and is used in conjunction with <code>accordion-panel</code>, which represents each panel in the group, to create a set of accessible content.</p>
			<p>Accordions are very much like tabs, but display content vertically. Accordions provide a few benefits, one of which is that there isn't really a physical limit to the number of accordion panels, as they’re displayed vertically. To that point, accordion buttons can also have more text explaining their purpose—though this should be kept to an absolute minimum.</p>
			<p>Another advantage is that multiple (or all) panels can be displayed at once.</p>
			<p>Accordions should only really be used with content, however, and should not be used to hide panels of a form. If this is the case, it is likely that the form is too complex and should be split over multiple pages. If a user needs to compare two panels or change between them regularly, tabs are a better choice as content does’t move.</p>
			<p>If only one panel is needed, to provide further context, for example, use the “Details” element instead.</p>
		</template>

		<component-props>
			<component-prop id="prop-heading-level">
				<template #name>
					headingLevel
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					h2
				</template>

				<p>The heading level to use for all panels.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The <code>default</code> slot contains the <code>accordion-panel</code> components that represent the content.</p>
			</component-slot>

			<component-slot id="slot-show-all-panels-label">
				<template #name>
					show-all-panels-label
				</template>

				<template #default-value>
					"Show all panels"
				</template>

				<p>The label for the button which shows all accordion panels.</p>
			</component-slot>

			<component-slot id="slot-hide-all-panels-label">
				<template #name>
					hide-all-panels-label
				</template>

				<template #default-value>
					"Hide all panels"
				</template>

				<p>The label for the button which hides all accordion panels.</p>
			</component-slot>

			<component-slot id="slot-show-panel-label">
				<template #name>
					show-panel-label
				</template>

				<template #default-value>
					"Show panel"
				</template>

				<p>The label for the individual panel buttons to show that panel.</p>
			</component-slot>

			<component-slot id="slot-hide-panel-label">
				<template #name>
					hide-panel-label
				</template>

				<template #default-value>
					"Hide panel"
				</template>

				<p>The label for the individual panel buttons to hide that panel.</p>
			</component-slot>

			<component-slot id="slot-accordion-panel-title">
				<template #name>
					title (<code>accordion-panel</code>)
				</template>

				<p>The title of the panel, which is used in the show / hide button.</p>
			</component-slot>

			<component-slot id="slot-accordion-panel-introduction">
				<template #name>
					introduction (<code>accordion-panel</code>)
				</template>

				<p>Any introduction to further explain the panel's content. If used, this should be as short as possible.</p>
			</component-slot>

			<component-slot id="slot-accordion-panel-default">
				<template #name>
					default (<code>accordion-panel</code>)
				</template>

				<p>The content of the accordion panel, which is shown when the panel is visible.</p>
			</component-slot>

			<component-slot id="slot-accordion-panel-show-panel-label">
				<template #name>
					show-panel-label (<code>accordion-panel</code>)
				</template>

				<template #default-value>
					"Show panel"
				</template>

				<p>The label to show this panel. Overrides the <code>show-panel-label</code> slot in the parent <code>accordion-group</code>.</p>
			</component-slot>

			<component-slot id="slot-accordion-panel-hide-panel-label">
				<template #name>
					hide-panel-label (<code>accordion-panel</code>)
				</template>

				<template #default-value>
					"Hide panel"
				</template>

				<p>The label to hide this panel. Overrides the <code>hide-panel-label</code> slot in the parent <code>accordion-group</code>.</p>
			</component-slot>
		</component-slots>

		<component-playgrounds>
			<playground-accordion-group />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundAccordionGroup from "./fragments/playground-accordion-group.vue";
</script>
