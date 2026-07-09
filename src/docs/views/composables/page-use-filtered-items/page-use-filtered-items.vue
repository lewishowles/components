<template>
	<component-page>
		<template #title>useFilteredItems</template>

		<template #introduction>
			<p>
				<code>useFilteredItems</code>
				filters a reactive list of items by exact property matches, returning the filtered list
				alongside a count and a
				<code>have</code>
				flag for empty-state checks. Useful for client-side table and list filtering without
				repeating the same filter logic in every view.
			</p>
		</template>

		<component-methods>
			<component-method id="method-use-filtered-items">
				<template #name>
					<code>useFilteredItems(items, filters?)</code>
				</template>

				<p>
					<code>items</code>
					is a plain array, a ref, or a getter returning an array.
					<code>filters</code>
					is a plain object, ref, or getter mapping a property path to an expected value; nested
					paths such as
					<code>profile.role</code>
					are supported. Mapping a property to an array matches any of those values. Omitting
					<code>filters</code>
					, or leaving it empty, returns every item.
				</p>
			</component-method>
		</component-methods>

		<component-returns>
			<component-return id="return-items">
				<template #name>items</template>

				<template #type>ComputedRef&lt;object[]&gt;</template>

				<p>The source items matching every provided filter.</p>
			</component-return>

			<component-return id="return-count">
				<template #name>count</template>

				<template #type>ComputedRef&lt;number&gt;</template>

				<p>The number of matching items.</p>
			</component-return>

			<component-return id="return-have">
				<template #name>have</template>

				<template #type>ComputedRef&lt;boolean&gt;</template>

				<p>Whether any items match, ready for an empty-state check.</p>
			</component-return>
		</component-returns>

		<component-tab v-bind="{ id: 'tab-examples', icon: 'icon-code' }">
			<template #title>Examples</template>

			<code-block :code="filteredItemsExample" />
		</component-tab>
	</component-page>
</template>

<script setup>
const filteredItemsExample = `import { useFilteredItems } from "@lewishowles/components/composables";

const users = [
	{ name: "Alice", role: "admin" },
	{ name: "Bob", role: "editor" },
	{ name: "Carol", role: "editor" },
];

const { count, have, items } = useFilteredItems(users, { role: "editor" });`;
</script>
