<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-breadcrumb-list" v-model="textSlots">
		<template #title>
			Breadcrumb list
		</template>

		<breadcrumb-list v-bind="componentProps" v-model="componentModel">
			<breadcrumb-item href="/">
				Admin
			</breadcrumb-item>
			<breadcrumb-item href="/users">
				Users
			</breadcrumb-item>
			<breadcrumb-item href="/users/43e7f9be-0eea-4756-bb86-afe8fb3c08c4">
				Sophie Wardhaugh
			</breadcrumb-item>
		</breadcrumb-list>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Props both for the template and for the component example itself.
const props = ref({});

const slots = {
	default: {
		value: [
			createTabItem("Admin", "/"),
			createTabItem("Users", "/users"),
			createTabItem("Sophie Wardhaugh", "/users/43e7f9be-0eea-4756-bb86-afe8fb3c08c4"),
		],
	},
};

function createTabItem(label, href) {
	return useTemplateGenerator("breadcrumb-item", {
		props: {
			href: {
				value: href,
				isInline: true,
			},
		},
		slots: {
			default: {
				value: label,
			},
		},
	});
}

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("breadcrumb-list", { slots, props });
</script>
