<template>
	<component-playground
		v-for="variant in playgroundVariants"
		v-bind="{ copy: variant.template.value }"
		:id="`playground-pill-badge-${variant.name}`"
		:key="variant.name"
		v-model="variant.textSlots.value"
	>
		<template #title>{{ variant.label }}</template>

		<template #introduction>
			<p>{{ variant.summary }}</p>
		</template>

		<pill-badge v-bind="variant.componentProps.value">
			{{ variant.textSlots.value.default?.value }}
		</pill-badge>
	</component-playground>
</template>

<script setup>
import { pick } from "@lewishowles/helpers/object";
import { pillBadgeMetadata } from "@/components/messaging/pill-badge/pill-badge.metadata.js";
import { useComponentPlayground } from "@/docs/views/components/composables/use-component-playground/use-component-playground";

// Metadata-backed playground variants that do not need extra local behaviour.
const playgroundVariants = pillBadgeMetadata.examples
	.filter((variant) => variant.playground)
	.map((variant) => ({
		...useComponentPlayground(pillBadgeMetadata, variant.name),
		...pick(variant, ["label", "name", "playground", "summary"]),
	}));
</script>
