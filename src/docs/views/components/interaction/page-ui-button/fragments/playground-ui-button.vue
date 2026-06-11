<template>
	<component-playground
		v-for="variant in playgroundVariants"
		v-bind="{ copy: variant.template.value }"
		:id="`playground-ui-button-${variant.name}`"
		:key="variant.name"
		v-model="variant.textSlots.value"
	>
		<template #title>{{ variant.label }}</template>

		<template #introduction>
			<p>{{ variant.summary }}</p>
		</template>

		<ui-button v-bind="variant.componentProps.value">
			{{ variant.textSlots.value.default?.value }}
		</ui-button>
	</component-playground>
</template>

<script setup>
import { pick } from "@lewishowles/helpers/object";
import { uiButtonMetadata } from "@/components/interaction/ui-button/ui-button.metadata.js";
import { useComponentPlayground } from "@/docs/views/components/composables/use-component-playground/use-component-playground";

// Metadata-backed playground variants that do not need extra local behaviour.
const playgroundVariants = uiButtonMetadata.examples
	.filter((variant) => variant.playground)
	.map((variant) => ({
		...useComponentPlayground(uiButtonMetadata, variant.name),
		...pick(variant, ["label", "name", "playground", "summary"]),
	}));
</script>
