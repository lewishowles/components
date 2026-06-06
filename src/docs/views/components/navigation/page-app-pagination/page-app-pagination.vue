<template>
	<component-page>
		<template #title>App pagination</template>

		<template #introduction>
			<p>
				Given the number of items being displayed,
				<code>app-pagination</code>
				builds a list of relevant buttons to allow the user to navigate that list.
			</p>
			<p>
				The calculations
				<code>app-pagination</code>
				makes are live, meaning that if the number of items changes (such as if a filter is
				applied), this may also change the pagination buttons shown, and will reset the current page
				back to the first page.
			</p>
			<p>
				Pagination will automatically be hidden if there are no items, or if the number of items
				given all fit onto a single page.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-count">
				<template #name>count</template>

				<template #type>Number</template>

				<template #default-value>0</template>

				<p>The number of items in the paginated collection.</p>
			</component-prop>

			<component-prop id="prop-items-per-page">
				<template #name>itemsPerPage</template>

				<template #type>Number</template>

				<template #default-value>10</template>

				<p>The number of items to display per page.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>default</template>

				<template #default-value>Label</template>

				<p>
					The label for the pagination, intended to explain to screen reader users the purpose of
					the navigation.
				</p>
			</component-slot>

			<component-slot id="slot-previous-page-label">
				<template #name>previous-page-label</template>

				<template #default-value>Previous page</template>

				<p>The label for the previous page button.</p>
			</component-slot>

			<component-slot id="slot-next-page-label">
				<template #name>next-page-label</template>

				<template #default-value>Next page</template>

				<p>The label for the next page button.</p>
			</component-slot>

			<component-slot id="slot-page-number-label">
				<template #name>page-number-label</template>

				<template #default-value>Page &#123;&#123; page &#125;&#125;</template>

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
				<template #name>showing-items-label</template>

				<template #default-value>
					Showing &#123;&#123; first &#125;&#125;&ndash;&#123;&#123; last &#125;&#125; of
					&#123;&#123; total &#125;&#125; items
				</template>

				<p>
					A display of the current items being shown, giving the user an indication of where they
					are in the list.
				</p>

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
				<template #name>v-model</template>

				<p>The currently selected page.</p>
			</component-event>

			<component-event id="event-update:page">
				<template #name>update:page</template>

				<p>
					Updated when the user selects a different page to display, containing a `page` parameter
					with that selected page.
				</p>

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

		<component-methods>
			<component-method id="method-go-to">
				<template #name>
					<code>goTo(page)</code>
				</template>

				<p>
					Navigate to a specific page number. The value is clamped to the valid range (1 to total
					pages). Accessible via a
					<code>ref</code>
					on the component.
				</p>

				<table>
					<thead>
						<tr>
							<th>Parameter</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>page</code></td>
							<td><code>number</code></td>
							<td>The page number to navigate to.</td>
						</tr>
					</tbody>
				</table>
			</component-method>

			<component-method id="expose-current-page">
				<template #name>
					<code>currentPage</code>
				</template>

				<p>
					A reactive number reflecting the currently active page. Writable — set it to navigate
					directly. Accessible via a
					<code>ref</code>
					on the component.
				</p>
			</component-method>

			<component-method id="expose-total-pages">
				<template #name>
					<code>totalPages</code>
				</template>

				<p>
					The total number of pages. Accessible via a
					<code>ref</code>
					on the component.
				</p>
			</component-method>

			<component-method id="expose-has-next">
				<template #name>
					<code>hasNext</code>
				</template>

				<p>
					A reactive boolean —
					<code>true</code>
					when there is a next page available. Accessible via a
					<code>ref</code>
					on the component.
				</p>
			</component-method>

			<component-method id="expose-has-prev">
				<template #name>
					<code>hasPrev</code>
				</template>

				<p>
					A reactive boolean —
					<code>true</code>
					when there is a previous page available. Accessible via a
					<code>ref</code>
					on the component.
				</p>
			</component-method>

			<component-method id="expose-next">
				<template #name>
					<code>next</code>
				</template>

				<p>
					Navigate to the next page. Accessible via a
					<code>ref</code>
					on the component.
				</p>
			</component-method>

			<component-method id="expose-prev">
				<template #name>
					<code>prev</code>
				</template>

				<p>
					Navigate to the previous page. Accessible via a
					<code>ref</code>
					on the component.
				</p>
			</component-method>
		</component-methods>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="app-pagination"</template>
				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-previous">
				<template #attribute>data-part="previous"</template>
				<p>The previous page button.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-page-list">
				<template #attribute>data-part="page-list"</template>
				<p>The list of page number buttons.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-next">
				<template #attribute>data-part="next"</template>
				<p>The next page button.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-app-pagination />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundAppPagination from "./fragments/playground-app-pagination.vue";
</script>
