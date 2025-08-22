<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-summary-details" v-model="textSlots">
		<template #title>
			Floating summary details
		</template>

		<template #introduction>
			<p>A floating <code>summary-details</code> allows content to be displayed without affecting the layout of the rest of the page, perfect for menus and optional actions.</p>
		</template>

		<summary-details v-bind="componentProps" v-model="componentModel">
			<template #summary>
				{{ textSlots.summary?.value }}
			</template>

			<div class="flex flex-col gap-4">
				<link-tag href="#" icon-start="icon-clipboard">
					Your orders
				</link-tag>
				<link-tag href="#" icon-start="icon-user">
					Your details
				</link-tag>
				<link-tag href="#" icon-start="icon-megaphone">
					Communication preferences
				</link-tag>
			</div>
		</summary-details>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	summary: {
		label: "Summary text",
		value: "Your account",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	"floating": {
		label: "Floating",
		value: true,
		type: "boolean",
	},
	"closeWithClickOutside": {
		label: "Close with click outside",
		value: true,
		type: "boolean",
	},
	"icon": {
		label: "Icon",
		value: "icon-user",
	},
	"iconAtStart": {
		label: "Icon",
		value: true,
		type: "boolean",
	},
	"summary-classes": {
		label: "Summary classes",
		value: "button--muted",
		isInline: true,
	},
	"details-classes": {
		label: "Details classes",
		value: "absolute top-full animate-fade-in-down end-0 w-screen mt-3 rounded-md border p-4 shadow border-grey-200 bg-white dark:border-transparent dark:bg-grey-950/20 backdrop-blur-lg max-w-lg",
		isInline: true,
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const additionalContent = useTemplateGenerator("div", {
	props: { class: { value: "flex flex-col gap-4", isInline: true } },
	additionalContent: [
		useTemplateGenerator("link-tag", {
			slots: { default: { value: "Your orders" } },
			props: {
				"href": { value: "#", isInline: true },
				"icon-start": { value: "icon-clipboard", isInline: true },
			},
			indent: 1,
		}),
		useTemplateGenerator("link-tag", {
			slots: { default: { value: "Your details" } },
			props: {
				"href": { value: "#", isInline: true },
				"icon-start": { value: "icon-user", isInline: true },
			},
			indent: 1,
		}),
		useTemplateGenerator("link-tag", {
			slots: { default: { value: "Communication preferences" } },
			props: {
				"href": { value: "#", isInline: true },
				"icon-start": { value: "icon-megaphone", isInline: true },
			},
			indent: 1,
		}),
	],
	indent: 1,
});

const template = useTemplateGenerator("summary-details", { slots: textSlots, props, additionalContent });
</script>
