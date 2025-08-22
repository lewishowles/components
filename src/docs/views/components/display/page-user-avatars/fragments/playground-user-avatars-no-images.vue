<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-user-avatars" v-model="textSlots">
		<template #title>
			No images
		</template>

		<template #introduction>
			<p>Avatars where no images are available.</p>
		</template>

		<user-avatars v-bind="componentProps" v-model="componentModel" />

		<template #additional-code>
			<code-block :code="`const users = ${JSON.stringify(users, null, '\t')};`" />
		</template>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

const users = [
	{ name: "Woody", initials: "W" },
	{ name: "Lotso", initials: "L" },
	{ name: "Sulley", initials: "S" },
	{ name: "Mike Wazowski", initials: "MW" },
	{ name: "Remy", initials: "R" },
	{ name: "Wall-E", initials: "WE" },
	{ name: "Moana", initials: "M" },
	{ name: "Merida", initials: "M" },
];

// Props both for the template and for the component example itself.
const props = ref({
	users: {
		label: "Users",
		value: users,
		type: "array",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("user-avatars", { props });
</script>
