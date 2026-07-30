<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-form-checkbox-group-card-option"
		v-model="textSlots"
	>
		<template #title>Card options</template>

		<form-checkbox-group v-bind="componentProps" v-model="componentModel">
			Choose plan features

			<template #option="{ option }">
				<span class="flex min-w-0 flex-1 items-start justify-between gap-3">
					<span class="min-w-0">
						<span class="block font-medium">{{ option.label }}</span>
						<span class="text-content-muted mt-1 block">{{ option.description }}</span>
					</span>

					<span class="shrink-0 font-medium">{{ option.price }}</span>
				</span>
			</template>
		</form-checkbox-group>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The currently selected plan features.
const componentModel = ref(["analytics"]);

// The custom option slot shown in the copied template.
const textSlots = ref({});

// The pricing tiers used by this example.
const props = ref({
	options: {
		label: "Options",
		value: [
			{
				label: "Analytics",
				description: "Track customer behaviour and conversion trends.",
				price: "£12",
				value: "analytics",
			},
			{
				label: "Priority support",
				description: "Get a response from our support team within one business day.",
				price: "£24",
				value: "priority-support",
			},
			{
				label: "Team seats",
				description: "Invite more people to manage your workspace.",
				price: "£36",
				value: "team-seats",
			},
		],
		type: "array",
		variableName: "features",
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

const template = useTemplateGenerator("form-checkbox-group", {
	additionalContent: optionTemplate,
	props,
	slots: textSlots,
});
</script>
