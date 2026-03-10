<template>
	<component-page>
		<template #title>
			Content divider
		</template>

		<template #introduction>
			<p>A standardised divider between content.</p>
		</template>

		<component-props>
			<component-prop id="prop-tag">
				<template #name>
					tag
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					div
				</template>

				<p>The tag to use for this divider. Generally, this is a <code>div</code> for visual dividers, and <code>hr</code> for content dividers.</p>
			</component-prop>
		</component-props>

		<component-playgrounds>
			<playground-content-divider />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundContentDivider from "./fragments/playground-content-divider.vue";
</script>
