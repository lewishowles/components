<template>
	<component-page>
		<template #title>Combo box</template>

		<template #introduction>
			<p>
				<code>combo-box</code>
				pairs a search input with a list of results, handling the keyboard, ARIA, and open/close
				behaviour of the combobox interaction pattern on top of the
				<router-link :to="{ name: 'use-combobox' }">
					<code>useCombobox</code>
				</router-link>
				composable.
			</p>

			<p>
				It deliberately does not filter. You pass the already-matched
				<code>items</code>
				and render each one through the default slot, so matching and ordering stay with whoever
				owns the data. This keeps the component agnostic to what each result is, which makes it well
				suited to a command menu fed by several sources (vehicles, users, pages), each matching
				itself before the results are combined into one list.
			</p>

			<p>
				The current search text is available via
				<code>v-model</code>
				. Choosing a result emits it through the
				<code>select</code>
				event.
			</p>
		</template>

		<component-keyboard-interaction>
			<table>
				<thead>
					<tr>
						<th>Key</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code>ArrowDown</code></td>
						<td>Open the results and highlight the first result, or move to the next result.</td>
					</tr>
					<tr>
						<td>
							<code>Alt</code>
							+
							<code>ArrowDown</code>
						</td>
						<td>Open the results without moving the highlight.</td>
					</tr>
					<tr>
						<td><code>ArrowUp</code></td>
						<td>Open the results and highlight the last result, or move to the previous result.</td>
					</tr>
					<tr>
						<td><code>Enter</code></td>
						<td>Choose the highlighted result, or close the results when none is highlighted.</td>
					</tr>
					<tr>
						<td><code>Escape</code></td>
						<td>Close the results.</td>
					</tr>
					<tr>
						<td>
							<code>ArrowLeft</code>
							/
							<code>ArrowRight</code>
							/
							<code>Home</code>
							/
							<code>End</code>
						</td>
						<td>Clear the highlighted result and use the input's normal text editing behaviour.</td>
					</tr>
				</tbody>
			</table>
		</component-keyboard-interaction>

		<component-props>
			<component-prop id="prop-items">
				<template #name>items</template>

				<template #type>array</template>

				<template #default-value>[]</template>

				<p>
					The results to display, already matched and ordered by the caller. Each item is rendered
					through the default slot and emitted as-is when chosen. Results may be merged from several
					sources without their IDs needing to be unique; each is tracked by its position in the
					list.
				</p>
			</component-prop>

			<component-prop id="prop-loading">
				<template #name>loading</template>

				<template #type>Boolean</template>

				<template #default-value>false</template>

				<p>
					Whether results are currently loading. While loading, a message is shown in place of the
					results.
				</p>
			</component-prop>

			<component-prop id="prop-id">
				<template #name>id</template>

				<template #type>String</template>

				<template #default-value>null</template>

				<p>
					Any ID to apply to the input. If an ID is not provided, one is generated at random. When
					providing an ID, please make sure that it is unique.
				</p>
			</component-prop>

			<component-prop id="prop-placeholder">
				<template #name>placeholder</template>

				<template #type>String</template>

				<template #default-value>null</template>

				<p>
					Any placeholder to show in the input. This can hint at the kind of value the user is
					searching for.
				</p>
			</component-prop>

			<component-prop id="prop-placement">
				<template #name>placement</template>

				<template #type>String</template>

				<template #default-value>"below"</template>

				<p>
					Whether to open the results above or below the input. The list flips to the opposite side
					if it would clip the viewport edge.
				</p>
			</component-prop>

			<component-prop id="prop-align">
				<template #name>align</template>

				<template #type>String</template>

				<template #default-value>"start"</template>

				<p>
					Whether to align the results to the start or end of the input. The list flips to the
					opposite side if it would clip the viewport edge.
				</p>
			</component-prop>

			<component-prop id="prop-dropdown-classes">
				<template #name>dropdownClasses</template>

				<template #type>String | Array | Object</template>

				<template #default-value>null</template>

				<p>
					Additional classes to apply to the results list, merged on top of its base styles. Any
					provided classes that conflict with base classes will override as necessary.
				</p>
			</component-prop>
		</component-props>

		<component-events>
			<component-event id="event-select">
				<template #name>select</template>

				<p>Emitted when the user chooses a result, with the original item as its payload.</p>
			</component-event>
		</component-events>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>default</template>

				<p>Renders the content of each result.</p>

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
							<td><code>item</code></td>
							<td><code>*</code></td>
							<td>The original item, exactly as you provided it.</td>
						</tr>
						<tr>
							<td><code>highlighted</code></td>
							<td><code>boolean</code></td>
							<td>Whether this result is currently highlighted.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-label">
				<template #name>label</template>

				<p>The input's label, describing what the user is searching.</p>
			</component-slot>

			<component-slot id="slot-introduction">
				<template #name>introduction</template>

				<p>Supporting text shown beneath the label.</p>
			</component-slot>

			<component-slot id="slot-no-results">
				<template #name>no-results</template>

				<p>Replaces the message shown when there are no results for the current query.</p>

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
							<td><code>query</code></td>
							<td><code>string</code></td>
							<td>The current search query.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-loading">
				<template #name>loading</template>

				<p>Replaces the message shown while results are loading.</p>
			</component-slot>
		</component-slots>

		<component-methods>
			<component-method id="method-trigger-focus">
				<template #name>
					<code>triggerFocus</code>
				</template>

				<p>Move focus to the input.</p>
			</component-method>
		</component-methods>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="combo-box"</template>

				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-combo-box />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundComboBox from "./fragments/playground-combo-box.vue";
</script>
