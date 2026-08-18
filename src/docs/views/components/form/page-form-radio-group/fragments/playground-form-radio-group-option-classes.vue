<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-form-radio-group-option-classes"
		v-model="textSlots"
	>
		<template #title>Custom option classes</template>

		<template #introduction>
			<code>optionClasses</code>
			is the escape hatch for anything the
			<code>card</code>
			variant does not cover. Use it without a variant when you need a fully custom option row.
		</template>

		<form-radio-group v-bind="componentProps" v-model="componentModel">
			Choose a plan

			<template #option="{ option, selected }">
				<span class="flex flex-1 items-center justify-between gap-3">
					<span class="flex w-full flex-col">
						<span class="text-content-strong font-bold">{{ option.label }}</span>
						<span class="text-content-muted block">{{ option.description }}</span>
					</span>

					<icon-chevron-right
						aria-hidden="true"
						class="group-hocus:translate-x-1 text-content-muted group-hocus:text-primary size-5 shrink-0 transition-transform"
						:class="{ hidden: selected }"
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

// The pricing tiers and custom row classes used by this example.
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
	"\t\t\t<icon-chevron-right",
	'\t\t\t\taria-hidden="true"',
	'\t\t\t\tclass="group-hocus:translate-x-1 text-content-muted group-hocus:text-primary size-5 shrink-0 transition-transform"',
	'\t\t\t\t:class="{ hidden: selected }"',
	"\t\t\t/>",
	"\t\t</span>",
	"\t</template>",
].join("\n");

const template = useTemplateGenerator("form-radio-group", {
	additionalContent: optionTemplate,
	props,
	slots: textSlots,
});
</script>
