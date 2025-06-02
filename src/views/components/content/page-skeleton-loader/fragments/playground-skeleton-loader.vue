<template>
	<component-playground v-bind="{ copy: template }" id="playground-skeleton-loader" v-model="textSlots">
		<template #title>
			Skeleton loader
		</template>

		<skeleton-loader>
			<template #label>
				{{ textSlots.label?.value }}
			</template>

			<div class="flex flex-wrap gap-4">
				<skeleton-indicator class="size-10 rounded-full" />
				<skeleton-indicator class="size-10 rounded-full" />
				<skeleton-indicator class="size-10 rounded-full" />
				<skeleton-indicator class="size-10 rounded-full" />
			</div>
		</skeleton-loader>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	label: {
		label: "Label",
		value: "Loading users…",
	},
});

const userSkeleton = useTemplateGenerator("skeleton-indicator", {
	props: {
		class: {
			value: "size-10 rounded-full",
			inline: true,
		},
	},
	indent: 2,
});

const additionalContent = useTemplateGenerator("div", {
	props: {
		class: {
			value: "flex flex-wrap gap-4",
			inline: true,
		},
	},
	additionalContent: [
		userSkeleton,
		userSkeleton,
		userSkeleton,
		userSkeleton,
	],
	indent: 1,
});

const template = useTemplateGenerator("skeleton-loader", { slots: textSlots, additionalContent });
</script>
