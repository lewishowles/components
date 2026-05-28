<template>
	<component-page>
		<template #title> Breadcrumb list </template>

		<template #introduction>
			<p>
				<code>breadcrumb-list</code> and its related <code>breadcrumb-item</code> allow you to
				provide a breadcrumb navigation trail to users. A breadcrumb trail should start from the
				&quot;home&quot; page, and end on the current page. All items except the current page should
				link to their relevant section.
			</p>

			<p>
				<code>breadcrumb-item</code> represents the individual breadcrumbs in a
				<code>breadcrumb-list</code>, and each should be a link to its relevant section, except for
				the current page. Use the <code>current</code> prop on the final item to mark it as the
				active page.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-label">
				<template #name> label </template>

				<template #type> String </template>

				<template #default-value> Breadcrumb </template>

				<p>
					The label for the breadcrumbs, intended to explain to screen reader users the purpose of
					the navigation.
				</p>
			</component-prop>

			<component-prop id="prop-href">
				<template #name> href (<code>breadcrumb-item</code>) </template>

				<template #type> String </template>

				<template #default-value> null </template>

				<p>
					The link to the breadcrumb item's section. Required when <code>current</code> is false.
				</p>
			</component-prop>

			<component-prop id="prop-current">
				<template #name> current (<code>breadcrumb-item</code>) </template>

				<template #type> Boolean </template>

				<template #default-value> false </template>

				<p>
					Whether this item represents the current page. When true, renders as a non-interactive
					<code>span</code> with <code>aria-current="page"</code> rather than a link.
				</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name> default </template>

				<p>Intended to contain one or more <code>breadcrumb-item</code> components.</p>
			</component-slot>

			<component-slot id="slot-default">
				<template #name> default (<code>breadcrumb-item</code>) </template>

				<p>The text content of the breadcrumb.</p>
			</component-slot>
		</component-slots>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component-list">
				<template #attribute>data-component="breadcrumb-list"</template>
				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-component-item">
				<template #attribute>data-component="breadcrumb-item"</template>
				<p>Present on each breadcrumb item's root element.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-current">
				<template #attribute>data-current</template>
				<p>
					Present on a <code>breadcrumb-item</code> root when the <code>current</code> prop is true.
				</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-breadcrumb-list />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundBreadcrumbList from "./fragments/playground-breadcrumb-list.vue";
</script>
