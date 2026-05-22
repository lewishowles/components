<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-content-card-custom-header"
		v-model="slots"
	>
		<template #title> Custom header </template>

		<template #introduction>
			A custom header replaces the default title layout while keeping the card header shell.
		</template>

		<content-card>
			<template #header>
				<div class="flex flex-col">
					<p class="flex items-center gap-1 text-sm text-red-600">
						<icon-warning />
						Warning
					</p>

					<p class="text-xl font-bold">Camera offline</p>
				</div>
			</template>

			{{ slots.default?.value }}
		</content-card>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

const warningTemplate = useTemplateGenerator("p", {
	props: {
		class: {
			value: "flex items-center gap-1 text-sm text-red-600",
			isInline: true,
		},
	},

	additionalContent: [
		useTemplateGenerator("icon-warning", {
			indent: 1,
		}),
		"\tWarning",
	],

	indent: 1,
});

const titleTemplate = useTemplateGenerator("p", {
	props: {
		class: {
			value: "text-xl font-bold",
			isInline: true,
		},
	},

	slots: {
		default: {
			value: "Camera offline",
		},
	},

	indent: 1,
});

const headerTemplate = useTemplateGenerator("div", {
	props: {
		class: {
			value: "flex flex-col",
			isInline: true,
		},
	},

	additionalContent: [warningTemplate, titleTemplate],

	indent: 1,
});

// Slots both for the template and for the component example itself.
const slots = ref({
	header: {
		label: "Header",
		value: headerTemplate.value,
	},
	default: {
		label: "Content",
		value: "The front door camera stopped reporting 2 minutes ago.",
		type: "textarea",
	},
});

const template = useTemplateGenerator("content-card", { slots });
</script>
