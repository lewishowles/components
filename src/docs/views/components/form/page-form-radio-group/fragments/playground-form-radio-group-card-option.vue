<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-form-radio-group-card-option"
		v-model="textSlots"
	>
		<template #title>Card options</template>

		<form-radio-group v-bind="componentProps" v-model="componentModel">
			Choose a plan

			<template #option="{ option }">
				<span class="flex min-w-0 flex-1 items-start justify-between gap-3">
					<span class="min-w-0">
						<span class="block font-medium">{{ option.label }}</span>
						<span class="text-content-muted mt-1 block">{{ option.description }}</span>
					</span>

					<span class="shrink-0 font-medium">{{ option.price }}</span>
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
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

// The custom option slot included in the copied template.
const optionTemplate = [
	'<template #option="{ option }">',
	"\t<span>",
	"\t\t<span>{{ option.label }}</span>",
	"\t\t<span>{{ option.description }}</span>",
	"\t\t<span>{{ option.price }}</span>",
	"\t</span>",
	"</template>",
].join("\n");

const template = useTemplateGenerator("form-radio-group", {
	additionalContent: optionTemplate,
	props,
	slots: textSlots,
});
</script>
