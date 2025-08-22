<template>
	<component-page>
		<template #title>
			Breadcrumb list
		</template>

		<template #introduction>
			<p><code>breadcrumb-list</code> and its related <code>breadcrumb-item</code> allow you to provide a breadcrumb navigation trail to users. A breadcrumb trail should start from the &quot;home&quot; page, and end on the page above the current page, and all items should link to their relevant section.</p>

			<p><code>breadcrumb-item</code> represents the individual breadcrumbs in a <code>breadcrumb-list</code>, and each should be a link to its relevant section.</p>
		</template>

		<component-props>
			<component-prop id="prop-label">
				<template #name>
					label
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					Breadcrumb
				</template>

				<p>The label for the breadcrumbs, intended to explain to screen reader users the purpose of the navigation.</p>
			</component-prop>

			<component-prop id="prop-href">
				<template #name>
					href (<code>breadcrumb-item</code>)
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>The link to the breadcrumb item's section.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>Intended to contain one or more <code>breadcrumb-item</code> components.</p>
			</component-slot>

			<component-slot id="slot-default">
				<template #name>
					default (<code>breadcrumb-item</code>)
				</template>

				<p>The text content of the breadcrumb.</p>
			</component-slot>
		</component-slots>

		<component-playgrounds>
			<playground-breadcrumb-list />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundBreadcrumbList from "./fragments/playground-breadcrumb-list.vue";
</script>
