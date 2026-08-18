<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-form-radio-group-card-option"
		v-model="textSlots"
	>
		<template #title>Custom card options</template>

		<template #introduction>
			Combine
			<code>variant="card"</code>
			with
			<code>optionClasses</code>
			and the
			<code>option</code>
			slot to build a custom card row.
		</template>

		<form-radio-group v-bind="componentProps" v-model="componentModel">
			Choose a plan

			<template #option="{ option }">
				<span class="flex min-w-0 flex-1 items-start justify-between gap-3">
					<span class="min-w-0">
						<span class="block font-medium">{{ option.label }}</span>
						<span class="text-content-muted block">{{ option.description }}</span>
					</span>

					<span class="shrink-0 font-medium">{{ option.price }}</span>

					<icon-chevron-right
						aria-hidden="true"
						class="group-hocus:translate-x-1 text-content-muted size-5 shrink-0 transition-transform"
					/>
				</span>
			</template>
		</form-radio-group>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The currently selected plan.
const componentModel = ref("startup");

// The custom option slot shown in the copied template.
const textSlots = ref({});

// The pricing tiers used by this example.
const props = ref({
	options: {
		label: "Options",
		value: [
			{
				label: "Hobby",
				description: "For trying an idea or personal project.",
				price: "£0",
				value: "hobby",
			},
			{
				label: "Startup",
				description: "For a growing team building its first product.",
				price: "£29",
				value: "startup",
			},
			{
				label: "Business",
				description: "For established teams with advanced needs.",
				price: "£99",
				value: "business",
			},
		],
		type: "array",
		variableName: "plans",
	},
	variant: {
		label: "Variant",
		value: "card",
	},
	optionClasses: {
		label: "Option classes",
		value:
			"hocus:border-primary hocus:bg-surface-subtle w-full rounded-lg border border-border py-3 pe-4 ps-6",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

// The custom option slot included in the copied template.
const optionTemplate = [
	'\t<template #option="{ option }">',
	'\t\t<span class="flex min-w-0 flex-1 items-start justify-between gap-3">',
	'\t\t\t<span class="min-w-0">',
	'\t\t\t\t<span class="block font-medium">{{ option.label }}</span>',
	'\t\t\t\t<span class="text-content-muted block">{{ option.description }}</span>',
	"\t\t\t</span>",
	'\t\t\t<span class="shrink-0 font-medium">{{ option.price }}</span>',
	'\t\t\t<icon-chevron-right aria-hidden="true" class="group-hocus:translate-x-1 size-5 shrink-0 text-content-muted transition-transform" />',
	"\t\t</span>",
	"\t</template>",
].join("\n");

const template = useTemplateGenerator("form-radio-group", {
	additionalContent: optionTemplate,
	props,
	slots: textSlots,
});
</script>
