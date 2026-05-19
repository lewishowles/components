<template>
	<component-page>
		<template #title>
			Dropdown menu
		</template>

		<template #introduction>
			<p>
				<code>dropdown-menu</code> provides an accessible action menu with a button trigger, <code>role="menu"</code> semantics, and full keyboard navigation. It's well suited to bulk action buttons, row-level controls in data tables, and any situation where a small set of actions needs to be de-cluttered from the interface.
			</p>

			<p>
				For a simple disclosure panel or floating content area, use
				<router-link v-bind="{ to: '/content/floating-details' }">
					<code>floating-details</code>
				</router-link>
				instead.
			</p>

			<p>To build up a standardised menu, use the companion components:</p>

			<ul>
				<li><code>dropdown-menu-button</code>, a styled action button</li>
				<li><code>dropdown-menu-checkbox</code>, a styled checkbox for selection</li>
				<li><code>dropdown-menu-link</code>, a styled link</li>
				<li><code>dropdown-menu-divider</code>, a visual divider between sections</li>
			</ul>

			<h3>Keyboard behaviour</h3>

			<table>
				<thead>
					<tr>
						<th>Key</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code>Enter</code> / <code>Space</code></td>
						<td>Open the menu (on trigger)</td>
					</tr>
					<tr>
						<td><code>ArrowDown</code> / <code>ArrowUp</code></td>
						<td>Open the menu and focus first item (on trigger); move between items (in menu)</td>
					</tr>
					<tr>
						<td><code>Home</code></td>
						<td>Focus the first item</td>
					</tr>
					<tr>
						<td><code>End</code></td>
						<td>Focus the last item</td>
					</tr>
					<tr>
						<td>Character keys</td>
						<td>Type-ahead: focus first item whose label starts with the typed text</td>
					</tr>
					<tr>
						<td><code>Escape</code></td>
						<td>Close menu, return focus to trigger</td>
					</tr>
					<tr>
						<td><code>Tab</code></td>
						<td>Close menu, move focus to next element</td>
					</tr>
				</tbody>
			</table>
		</template>

		<component-props>
			<component-prop id="prop-summary-classes">
				<template #name>
					summaryClasses
				</template>

				<template #type>
					string, array, object
				</template>

				<p>Additional classes applied to the trigger button. Defaults to the standard muted button styling.</p>
			</component-prop>

			<component-prop id="prop-details-classes">
				<template #name>
					detailsClasses
				</template>

				<template #type>
					string, array, object
				</template>

				<p>Additional classes applied to the menu panel. Defaults to the standard panel styling.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-summary">
				<template #name>
					summary
				</template>

				<p>The trigger button content.</p>

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
							<td>Whether the menu is currently open.</td>
						</tr>
						<tr>
							<td><code>openMenu</code></td>
							<td><code>function</code></td>
							<td>Open the menu programmatically.</td>
						</tr>
						<tr>
							<td><code>closeMenu</code></td>
							<td><code>function</code></td>
							<td>Close the menu programmatically.</td>
						</tr>
						<tr>
							<td><code>toggleMenu</code></td>
							<td><code>function</code></td>
							<td>Toggle the menu open or closed.</td>
						</tr>
						<tr>
							<td><code>triggerProps</code></td>
							<td><code>object</code></td>
							<td>ARIA attributes (<code>aria-haspopup</code>, <code>aria-expanded</code>, <code>aria-controls</code>) to spread onto a custom trigger element.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The menu items, shown when the menu is open.</p>

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
							<td>Whether the menu is currently open.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>
		</component-slots>

		<component-events>
			<component-event id="event-open">
				<template #name>
					open
				</template>

				<p>Fired when the menu opens.</p>
			</component-event>

			<component-event id="event-close">
				<template #name>
					close
				</template>

				<p>Fired when the menu closes.</p>
			</component-event>
		</component-events>

		<component-methods>
			<component-method id="method-open-menu">
				<template #name>
					<code>openMenu</code>
				</template>

				<p>Open the menu programmatically.</p>
			</component-method>

			<component-method id="method-close-menu">
				<template #name>
					<code>closeMenu</code>
				</template>

				<p>Close the menu programmatically.</p>
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
