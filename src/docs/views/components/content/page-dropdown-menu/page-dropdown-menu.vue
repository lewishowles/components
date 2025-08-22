<template>
	<component-page>
		<template #title>
			Dropdown menu
		</template>

		<template #introduction>
			<p>
				<code>dropdown-menu</code> is an extension of
				<router-link v-bind="{ to: '/content/floating-details' }">
					<code>floating-details</code>
				</router-link>,
				providing a quick and easy way to create dropdown or action menus. From actions in tables to bulk item management, dropdown menus provide an easy, accessible way to de-clutter an interface, but should not be used where very common actions would be hidden and more difficult to access for the sake of cleanliness.
			</p>

			<p>To simplify the creation of a standardised menu, there are a number of companion components that can be used to build up a menu, including:</p>

			<ul>
				<li><code>dropdown-menu-button</code>, a styled extension of <code>ui-button</code></li>
				<li><code>dropdown-menu-link</code>, a styled extension of <code>link-tag</code></li>
				<li><code>dropdown-menu-divider</code>, a thematically appropriate divider between menu sections</li>
			</ul>
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

				<p>Whether the menu should initially be open.</p>
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

				<p>Whether to close the menu when pressing escape. If focus is within this component, focus is moved to the summary element.</p>
			</component-prop>

			<component-prop id="prop-close-with-click-outside">
				<template #name>
					closeWithClickOutside
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					true
				</template>

				<p>Whether to close the menu when clicking outside of the component.</p>
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

				<p>When floating, whether to align to the dropdown to the start or end of the summary. This is useful for menus that open to the end of the screen, for example. Anything but "start" will be treated as "end".</p>
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
							<th class="whitespace-nowrap">
								Slot prop
							</th>
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

				<p>The content to be displayed in the menu when open.</p>
				<table>
					<thead>
						<tr>
							<th class="whitespace-nowrap">
								Slot prop
							</th>
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

				<p>Fired when the menu is opened.</p>
			</component-event>

			<component-event id="event-close">
				<template #name>
					close
				</template>

				<p>Fired when the menu is closed.</p>
			</component-event>
		</component-events>

		<component-methods>
			<component-method id="method-open-menu">
				<template #name>
					<code>openMenu</code>
				</template>

				<p>Open the menu.</p>
			</component-method>

			<component-method id="method-close-menu">
				<template #name>
					<code>closeMenu</code>
				</template>

				<p>Close the menu.</p>
			</component-method>
		</component-methods>

		<component-playgrounds>
			<playground-dropdown-menu />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundDropdownMenu from "./fragments/playground-dropdown-menu.vue";
</script>
