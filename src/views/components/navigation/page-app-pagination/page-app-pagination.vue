<template>
	<component-page>
		<template #title>
			App pagination
		</template>

		<template #introduction>
			<p>Given the number of items being displayed, <code>app-pagination</code> builds a list of relevant buttons to allow the user to navigate that list.</p>
			<p>The calculations <code>app-pagination</code> makes are live, meaning that if the number of items changes (such as if a filter is applied), this may also change the pagination buttons shown, and will reset the current page back to the first page.</p>
			<p>Pagination will automatically be hidden if there are no items, or if the number of items given all fit onto a single page.</p>
		</template>

		<component-props>
			<component-prop id="prop-count">
				<template #name>
					count
				</template>

				<template #type>
					Number
				</template>

				<template #default-value>
					0
				</template>

				<p>The number of items in the paginated collection.</p>
			</component-prop>

			<component-prop id="prop-label">
				<template #name>
					label
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					Pagination
				</template>

				<p>The label for the pagination, intended to explain to screen reader users the purpose of the navigation.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-previous-page-label">
				<template #name>
					previous-page-label
				</template>

				<template #default-value>
					Previous page
				</template>

				<p>The label for the previous page button.</p>
			</component-slot>

			<component-slot id="slot-next-page-label">
				<template #name>
					next-page-label
				</template>

				<template #default-value>
					Next page
				</template>

				<p>The label for the next page button.</p>
			</component-slot>

			<component-slot id="slot-page-number-label">
				<template #name>
					page-number-label
				</template>

				<template #default-value>
					Page &#123;&#123; page &#125;&#125;
				</template>

				<p>The accessible label for each page.</p>

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
							<td><code>page</code></td>
							<td><code>number</code></td>
							<td>The page number for the given page.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-showing-items-label">
				<template #name>
					showing-items-label
				</template>

				<template #default-value>
					Showing &#123;&#123; first &#125;&#125;&ndash;&#123;&#123; last &#125;&#125; of &#123;&#123; total &#125;&#125; items
				</template>

				<p>A display of the current items being shown, giving the user an indication of where they are in the list.</p>

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
							<td><code>first</code></td>
							<td><code>number</code></td>
							<td>The first item being displayed.</td>
						</tr>
						<tr>
							<td><code>last</code></td>
							<td><code>number</code></td>
							<td>The last item being displayed.</td>
						</tr>
						<tr>
							<td><code>total</code></td>
							<td><code>number</code></td>
							<td>The total number of items in the list.</td>
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

				<p>The currently selected page.</p>
			</component-event>

			<component-event id="event-update:page">
				<template #name>
					update:page
				</template>

				<p>Updated when the user selects a different page to display, containing a `page` parameter with that selected page.</p>

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
							<td><code>page</code></td>
							<td><code>number</code></td>
							<td>The number of the new page.</td>
						</tr>
					</tbody>
				</table>
			</component-event>
		</component-events>

		<component-playgrounds>
			<playground-app-pagination />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundAppPagination from "./fragments/playground-app-pagination.vue";
</script>
