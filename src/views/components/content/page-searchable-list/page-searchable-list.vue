<template>
	<component-page>
		<template #title>
			Searchable list
		</template>

		<template #introduction>
			<p>Provided an array of objects, <code>searchable-list</code> provides a search box to filter those objects. The list of results is provided to the default slot, meaning they can be displayed however best suits the implementation.</p>
			<p>If no search is being performed, the whole list is returned.</p>
			<p>Each property of an object is recursively, case-insensitively searched, and individual properties can be excluded via the <code>exclude</code> prop. Alternatively, only certain properties can be included via the <code>include</code> prop.</p>
		</template>

		<component-props>
			<component-prop id="prop-data">
				<template #name>
					data
				</template>

				<template #type>
					array
				</template>

				<template #default-value>
					null
				</template>

				<p>The list of items to search, or display if no search is being performed. This should be an array of objects. Any non-object entries will be ignored.</p>
			</component-prop>

			<component-prop id="prop-placeholder">
				<template #name>
					placeholder
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Any placeholder to provide to the search input. This can be used to indicate the kinds of data the user can search for.</p>
			</component-prop>

			<component-prop id="prop-exclude">
				<template #name>
					exclude
				</template>

				<template #type>
					Array
				</template>

				<template #default-value>
					null
				</template>

				<p>The list of object properties that should not be included in the search.</p>
			</component-prop>

			<component-prop id="prop-include">
				<template #name>
					include
				</template>

				<template #type>
					Array
				</template>

				<template #default-value>
					null
				</template>

				<p>The list of object properties that should be searched exclusively.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The main &quot;results&quot; display.</p>

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
							<td><code>items</code></td>
							<td><code>array</code></td>
							<td>The list of items matching any current search options, or all items if no search is being performed.</td>
						</tr>
						<tr>
							<td><code>query</code></td>
							<td><code>string</code></td>
							<td>The current search query.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-label">
				<template #name>
					label
				</template>

				<p>The search input label, giving the user an idea of what they are searching.</p>
			</component-slot>

			<component-slot id="slot-results-count">
				<template #name>
					results-count
				</template>

				<p>A slot to override the default results count display, appearing beneath the search box.</p>

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
							<td><code>performingSearch</code></td>
							<td><code>boolean</code></td>
							<td>Whether a search is currently being performed.</td>
						</tr>
						<tr>
							<td><code>resultCount</code></td>
							<td><code>number</code></td>
							<td>The number of results found.</td>
						</tr>
						<tr>
							<td><code>itemCount</code></td>
							<td><code>number</code></td>
							<td>The total number of items provided.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-reset-search-label">
				<template #name>
					reset-search-label
				</template>

				<p>The label for the reset search button.</p>
			</component-slot>
		</component-slots>

		<component-methods>
			<component-method id="method-reset-search">
				<template #name>
					<code>resetSearch</code>
				</template>

				<p>Resets the current search query for the user.</p>
			</component-method>

			<component-method id="method-trigger-focus">
				<template #name>
					<code>triggerFocus</code>
				</template>

				<p>Trigger focus on the search input.</p>
			</component-method>
		</component-methods>

		<component-playgrounds>
			<playground-searchable-list />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundSearchableList from "./fragments/playground-searchable-list.vue";
</script>
