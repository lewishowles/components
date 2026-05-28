<template>
	<component-page>
		<template #title> Summary details </template>

		<template #introduction>
			<p>
				Provides an implementation of the <code>details</code> element with optional extras, such as
				custom icons, and allows a simple way of having content that can be toggled. Suitable for
				items such as FAQs or even dropdown menus.
			</p>

			<p>
				When closed, the content is hidden using <code>hidden=&quot;until-found&quot;</code>, making
				it discoverable by find-in-page searches. When the user finds text within a closed
				<code>summary-details</code>, the component is automatically kept in sync.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-open">
				<template #name> open </template>

				<template #type> Boolean </template>

				<template #default-value> false </template>

				<p>Whether the details element should initially be open.</p>
			</component-prop>

			<component-prop id="prop-autofocus">
				<template #name> autofocus </template>

				<template #type> Boolean </template>

				<template #default-value> false </template>

				<p>
					Whether to focus the first focusable element in the content area when the details are
					opened. Useful when the content contains a form or an action the user is expected to
					interact with immediately.
				</p>
			</component-prop>

			<component-prop id="prop-toggletip">
				<template #name> toggletip </template>

				<template #type> Boolean </template>

				<template #default-value> false </template>

				<p>
					Whether to treat the content as a toggletip, content which is announced immediately when
					opened. This is good for information tooltips, for example.
				</p>
			</component-prop>

			<component-prop id="prop-close-with-escape">
				<template #name> closeWithEscape </template>

				<template #type> Boolean </template>

				<template #default-value> true </template>

				<p>
					Whether to close the details element when pressing escape. If focus is within this
					component, focus is moved to the summary element.
				</p>
			</component-prop>

			<component-prop id="prop-close-with-click-outside">
				<template #name> closeWithClickOutside </template>

				<template #type> Boolean </template>

				<template #default-value> false </template>

				<p>
					Whether to close the details element when clicking outside of the component. This is best
					combined with <code>floating</code> for menus.
				</p>
			</component-prop>

			<component-prop id="prop-icon-open">
				<template #name> iconOpen </template>

				<template #type> String </template>

				<template #default-value> icon-chevron-up </template>

				<p>The icon to display when the details are open.</p>
			</component-prop>

			<component-prop id="prop-icon-closed">
				<template #name> iconClosed </template>

				<template #type> String </template>

				<template #default-value> icon-chevron-down </template>

				<p>The icon to display when the details are closed.</p>
			</component-prop>

			<component-prop id="prop-icon">
				<template #name> icon </template>

				<template #type> String </template>

				<template #default-value> null </template>

				<p>An override icon, shown both when details are open and closed.</p>
			</component-prop>

			<component-prop id="prop-icon-at-start">
				<template #name> iconAtStart </template>

				<template #type> Boolean </template>

				<template #default-value> false </template>

				<p>Whether to display the icon at the start of the summary, as opposed to the end.</p>
			</component-prop>

			<component-prop id="prop-include-icon">
				<template #name> includeIcon </template>

				<template #type> Boolean </template>

				<template #default-value> true </template>

				<p>
					Whether to include a summary icon at all. This allows more flexibility with the styling of
					the summary, but it is important to make it clear to the user what is happening.
				</p>
			</component-prop>

			<component-prop id="prop-summary-classes">
				<template #name> summaryClasses </template>

				<template #type> String </template>

				<template #default-value> null </template>

				<p>
					Any classes to add to the summary element, allowing styling to wrap both the summary and
					icons.
				</p>
			</component-prop>

			<component-prop id="prop-details-classes">
				<template #name> detailsClasses </template>

				<template #type> String </template>

				<template #default-value> null </template>

				<p>Any classes to add to the details content wrapper.</p>
			</component-prop>

			<component-prop id="prop-icon-classes">
				<template #name> iconClasses </template>

				<template #type> String </template>

				<template #default-value> null </template>

				<p>
					Any classes to add to the icon itself. Particularly useful if the icon is the only visible
					summary element.
				</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-summary">
				<template #name> summary </template>

				<p>The content to be displayed in the summary.</p>

				<table>
					<thead>
						<tr>
							<th class="whitespace-nowrap">Slot prop</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>isOpen</code></td>
							<td><code>boolean</code></td>
							<td>Whether the details are currently visible.</td>
						</tr>
						<tr>
							<td><code>icon</code></td>
							<td><code>string</code></td>
							<td>The computed icon to display for the current state.</td>
						</tr>
						<tr>
							<td><code>open</code></td>
							<td><code>function</code></td>
							<td>Opens the details.</td>
						</tr>
						<tr>
							<td><code>close</code></td>
							<td><code>function</code></td>
							<td>Closes the details.</td>
						</tr>
						<tr>
							<td><code>toggle</code></td>
							<td><code>function</code></td>
							<td>Toggles the details between open and closed.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-default">
				<template #name> default </template>

				<p>The content to be displayed in the details element when open.</p>

				<table>
					<thead>
						<tr>
							<th class="whitespace-nowrap">Slot prop</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>isOpen</code></td>
							<td><code>boolean</code></td>
							<td>Whether the details are currently visible.</td>
						</tr>
						<tr>
							<td><code>icon</code></td>
							<td><code>string</code></td>
							<td>The computed icon to display for the current state.</td>
						</tr>
						<tr>
							<td><code>open</code></td>
							<td><code>function</code></td>
							<td>Opens the details.</td>
						</tr>
						<tr>
							<td><code>close</code></td>
							<td><code>function</code></td>
							<td>Closes the details.</td>
						</tr>
						<tr>
							<td><code>toggle</code></td>
							<td><code>function</code></td>
							<td>Toggles the details between open and closed.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>
		</component-slots>

		<component-events>
			<component-event id="event-v-model">
				<template #name> v-model </template>

				<p>The current status of the component, and whether it is open.</p>
			</component-event>

			<component-event id="event-open">
				<template #name> open </template>

				<p>Fired when the details element is opened.</p>
			</component-event>

			<component-event id="event-close">
				<template #name> close </template>

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

			<component-method id="method-toggle-details">
				<template #name>
					<code>toggleDetails</code>
				</template>

				<p>Toggle the details between open and closed.</p>
			</component-method>
		</component-methods>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="summary-details"</template>

				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-summary">
				<template #attribute>data-part="summary"</template>

				<p>The <code>&lt;summary&gt;</code> element that acts as the toggle trigger.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-content">
				<template #attribute>data-part="content"</template>

				<p>The content region revealed when the details are open.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-state">
				<template #attribute>data-state</template>

				<p>
					Set to <code>"open"</code> when the details are visible, <code>"closed"</code> when
					hidden.
				</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-summary-details />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundSummaryDetails from "./fragments/playground-summary-details.vue";
</script>
