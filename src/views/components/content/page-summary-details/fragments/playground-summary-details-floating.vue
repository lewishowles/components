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
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

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
		inline: true,
	},
	"details-classes": {
		label: "Details classes",
		value: "animate-fade-in-down animate-fast mt-2 min-w-3xs rounded-lg border border-grey-200 bg-white p-4 shadow-sm dark:border-white/20 dark:bg-grey-800",
		inline: true,
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const additionalContent = useTemplateGenerator("div", {
	props: { class: { value: "flex flex-col gap-4", inline: true } },
	additionalContent: [
		useTemplateGenerator("link-tag", {
			slots: { default: { value: "Your orders" } },
			props: {
				"href": { value: "#", inline: true },
				"icon-start": { value: "icon-clipboard", inline: true },
			},
			indent: 1,
		}),
		useTemplateGenerator("link-tag", {
			slots: { default: { value: "Your details" } },
			props: {
				"href": { value: "#", inline: true },
				"icon-start": { value: "icon-user", inline: true },
			},
			indent: 1,
		}),
		useTemplateGenerator("link-tag", {
			slots: { default: { value: "Communication preferences" } },
			props: {
				"href": { value: "#", inline: true },
				"icon-start": { value: "icon-megaphone", inline: true },
			},
			indent: 1,
		}),
	],
	indent: 1,
});

const template = useTemplateGenerator("summary-details", { slots: textSlots, props, additionalContent });
</script>
