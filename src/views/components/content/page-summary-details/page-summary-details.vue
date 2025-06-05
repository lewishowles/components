<template>
	<component-page>
		<template #title>
			Summary details
		</template>

		<template #introduction>
			<p>Provides an implementation of the <code>details</code> element with optional extras, such as custom icons, and allows a simple way of having content that can be toggled. Suitable for items such as FAQs or even dropdown menus.</p>
		</template>

		<component-props>
			<component-prop id="prop-open">
				<template #name>
					open
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					false
				</template>

				<p>Whether the details element should initially be open.</p>
			</component-prop>

			<component-prop id="prop-close-with-escape">
				<template #name>
					closeWithEscape
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					true
				</template>

				<p>Whether to close the details element when pressing escape. If focus is within this component, focus is moved to the summary element.</p>
			</component-prop>

			<component-prop id="prop-close-with-click-outside">
				<template #name>
					closeWithClickOutside
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					false
				</template>

				<p>Whether to close the details element when clicking outside of the component. This is best combined with <code>floating</code> for menus.</p>
			</component-prop>

			<component-prop id="prop-icon-open">
				<template #name>
					iconOpen
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					icon-chevron-up
				</template>

				<p>The icon to display when the details are open.</p>
			</component-prop>

			<component-prop id="prop-icon-closed">
				<template #name>
					iconClosed
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					icon-chevron-down
				</template>

				<p>The icon to display when the details are closed.</p>
			</component-prop>

			<component-prop id="prop-icon">
				<template #name>
					icon
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>An override icon, shown both when details are open and closed.</p>
			</component-prop>

			<component-prop id="prop-icon-at-start">
				<template #name>
					iconAtStart
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					false
				</template>

				<p>Whether to display the icon at the start of the summary, as opposed to the end.</p>
			</component-prop>

			<component-prop id="prop-include-icon">
				<template #name>
					includeIcon
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					true
				</template>

				<p>Whether to include a summary icon at all. This allows more flexibility with the styling of the summary, but it is important to make it clear to the user what is happening.</p>
			</component-prop>

			<component-prop id="prop-floating">
				<template #name>
					floating
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					false
				</template>

				<p>Whether the details should float when opened, perfect for drop down menus.</p>
			</component-prop>

			<component-prop id="prop-align">
				<template #name>
					align
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					start
				</template>

				<p>When floating, whether to align to the dropdown to the start or end of the summary. This is useful for menus that open to the end of the screen, for example. Anything but <code>start</code> will be treated as <code>end</code>.</p>
			</component-prop>

			<component-prop id="prop-summary-classes">
				<template #name>
					summaryClasses
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Any classes to add to the summary element, allowing styling to wrap both the summary and icons.</p>
			</component-prop>

			<component-prop id="prop-details-classes">
				<template #name>
					detailsClasses
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Any classes to add to the details content wrapper.</p>
			</component-prop>

			<component-prop id="prop-icon-classes">
				<template #name>
					iconClasses
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Any classes to add to the icon itself. Particularly useful if the icon is the only visible summary element.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-summary">
				<template #name>
					summary
				</template>

				<p>The content to be displayed in the summary.</p>

				<table>
					<thead>
						<tr>
							<th>Slot prop</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>open</code></td>
							<td><code>boolean</code></td>
							<td>Whether the details are currently visible.</td>
						</tr>
						<tr>
							<td><code>icon</code></td>
							<td><code>string</code></td>
							<td>The computed icon to display for the current state.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The content to be displayed in the details element when open.</p>

				<table>
					<thead>
						<tr>
							<th>Slot prop</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>open</code></td>
							<td><code>boolean</code></td>
							<td>Whether the details are currently visible.</td>
						</tr>
						<tr>
							<td><code>icon</code></td>
							<td><code>string</code></td>
							<td>The computed icon to display for the current state.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>
		</component-slots>

		<component-events>
			<component-event id="event-v-model">
				<template #name>
					v-model
				</template>

				<p>The current status of the component, and whether it is open.</p>
			</component-event>

			<component-event id="event-open">
				<template #name>
					open
				</template>

				<p>Fired when the details element is opened.</p>
			</component-event>

			<component-event id="event-close">
				<template #name>
					close
				</template>

				<p>Fired when the details element is closed.</p>
			</component-event>
		</component-events>

		<component-methods>
			<component-method id="method-open-details">
				<template #name>
					<code>openDetails</code>
				</template>

				<p>Open the details.</p>
			</component-method>

			<component-method id="method-close-details">
				<template #name>
					<code>closeDetails</code>
				</template>

				<p>Close the details.</p>
			</component-method>
		</component-methods>

		<component-playgrounds>
			<playground-summary-details />
			<playground-summary-details-floating />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundSummaryDetails from "./fragments/playground-summary-details.vue";
import PlaygroundSummaryDetailsFloating from "./fragments/playground-summary-details-floating.vue";
</script>
