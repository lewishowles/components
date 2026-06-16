<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-content-card-custom-header"
		v-model="slots"
	>
		<template #title>Custom header</template>

		<template #introduction>
			A custom header replaces the default title layout while keeping the card header shell.
		</template>

		<content-card>
			<content-card-header>
				<template #header>
					<div class="flex flex-col">
						<p class="flex items-center gap-1 text-sm text-red-600">
							<icon-warning />
							Warning
						</p>

						<h3 class="text-content-strong text-xl font-bold">Camera offline</h3>
					</div>
				</template>
			</content-card-header>

			<content-card-section>
				{{ slots.default?.value }}
			</content-card-section>
		</content-card>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
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

const titleTemplate = useTemplateGenerator("h3", {
	props: {
		class: {
			value: "text-content-strong text-xl font-bold",
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

const headerInnerTemplate = useTemplateGenerator("div", {
	props: {
		class: {
			value: "flex flex-col",
			isInline: true,
		},
	},

	additionalContent: [warningTemplate, titleTemplate],

	indent: 1,
});

const headerTemplate = useTemplateGenerator("content-card-header", {
	slots: computed(() => ({
		header: { value: headerInnerTemplate.value },
	})),
	indent: 1,
});

const slots = ref({
	default: {
		label: "Content",
		value: "The front door camera stopped reporting 2 minutes ago.",
		type: "textarea",
	},
});

const sectionTemplate = useTemplateGenerator("content-card-section", {
	slots: computed(() => ({ default: slots.value.default })),
	indent: 1,
});

const template = useTemplateGenerator("content-card", {
	additionalContent: [headerTemplate, sectionTemplate],
});
</script>
