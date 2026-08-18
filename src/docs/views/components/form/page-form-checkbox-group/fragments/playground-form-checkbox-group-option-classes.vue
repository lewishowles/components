<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-form-checkbox-group-option-classes"
		v-model="textSlots"
	>
		<template #title>Custom option classes</template>

		<template #introduction>
			<code>optionClasses</code>
			is the escape hatch for anything the
			<code>card</code>
			variant does not cover. Use it without a variant when you need a fully custom option row.
		</template>

		<form-checkbox-group v-bind="componentProps" v-model="componentModel">
			Choose plan features

			<template #option="{ option }">
				<span class="flex flex-1 items-center justify-between gap-3">
					<span class="flex w-full flex-col">
						<span class="text-content-strong font-bold">{{ option.label }}</span>
						<span class="text-content-muted block">{{ option.description }}</span>
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

// The pricing tiers and custom row classes used by this example.
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
	"option-classes": {
		label: "Option classes",
		value:
			"has-checked:bg-primary-subtle has-checked:hocus-within:bg-primary-subtle has-checked:border-primary hocus-within:bg-surface-subtle border-border w-full rounded-lg border py-3 ps-6 pe-4",
		isInline: true,
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

// The custom option slot included in the copied template.
const optionTemplate = [
	'\t<template #option="{ option }">',
	'\t\t<span class="flex flex-1 items-center justify-between gap-3">',
	'\t\t\t<span class="flex w-full flex-col">',
	'\t\t\t\t<span class="block font-medium">{{ option.label }}</span>',
	'\t\t\t\t<span class="text-content-muted block">{{ option.description }}</span>',
	"\t\t\t</span>",
	'\t\t\t<span class="shrink-0 font-medium">{{ option.price }}</span>',
	"\t\t</span>",
	"\t</template>",
].join("\n");

const template = useTemplateGenerator("form-checkbox-group", {
	additionalContent: optionTemplate,
	props,
	slots: textSlots,
});
</script>
