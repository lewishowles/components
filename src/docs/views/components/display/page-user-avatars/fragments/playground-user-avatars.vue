<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-user-avatars" v-model="textSlots">
		<template #title>
			User avatars
		</template>

		<template #introduction>
			<p>A simple list of avatars with all information.</p>
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
	{ name: "Woody", initials: "W", avatar: "https://picsum.photos/100/100.webp?random=1" },
	{ name: "Lotso", initials: "L", avatar: "https://picsum.photos/100/100.webp?random=2" },
	{ name: "Sulley", initials: "S", avatar: "https://picsum.photos/100/100.webp?random=3" },
	{ name: "Mike Wazowski", initials: "MW", avatar: "https://picsum.photos/100/100.webp?random=4" },
	{ name: "Remy", initials: "R", avatar: "https://picsum.photos/100/100.webp?random=5" },
	{ name: "Wall-E", initials: "WE", avatar: "https://picsum.photos/100/100.webp?random=6" },
	{ name: "Moana", initials: "M", avatar: "https://picsum.photos/100/100.webp?random=7" },
	{ name: "Merida", initials: "M", avatar: "https://picsum.photos/100/100.webp?random=8" },
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
