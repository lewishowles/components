<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-dropdown-menu" v-model="textSlots">
		<template #title>
			Dropdown menu
		</template>

		<dropdown-menu v-bind="componentProps" v-model="componentModel">
			<template #summary>
				{{ textSlots.summary?.value }}
			</template>

			<dropdown-menu-button icon="icon-pencil">
				Edit
			</dropdown-menu-button>

			<dropdown-menu-button icon="icon-reload">
				Refresh
			</dropdown-menu-button>

			<dropdown-menu-divider />

			<dropdown-menu-button icon="icon-bin">
				Delete
			</dropdown-menu-button>
		</dropdown-menu>
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
		label: "Summary",
		value: "Bulk actions",
	},
});

const additionalContent = [
	useTemplateGenerator("dropdown-menu-button", {
		props: { icon: { value: "icon-pencil", isInline: true } },
		slots: { default: { value: "Edit" } },
		indent: 1,
	}),
	useTemplateGenerator("dropdown-menu-button", {
		props: { icon: { value: "icon-reload", isInline: true } },
		slots: { default: { value: "Refresh" } },
		indent: 1,
	}),
	useTemplateGenerator("dropdown-menu-divider", { indent: 1 }),
	useTemplateGenerator("dropdown-menu-button", {
		props: { icon: { value: "icon-bin", isInline: true } },
		slots: { default: { value: "Delete" } },
		indent: 1,
	}),
];

// Props both for the template and for the component example itself.
const props = ref({});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("dropdown-menu", { slots: textSlots, props, additionalContent });
</script>
