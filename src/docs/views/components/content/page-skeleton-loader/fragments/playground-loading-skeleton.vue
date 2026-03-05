<template>
	<component-playground v-bind="{ copy: template }" id="playground-loading-skeleton" v-model="textSlots">
		<template #title>
			Skeleton loader
		</template>

		<loading-skeleton>
			<template #label>
				{{ textSlots.label?.value }}
			</template>

			<div class="flex flex-wrap gap-1">
				<loading-skeleton-indicator class="size-10 rounded-full" />
				<loading-skeleton-indicator class="size-10 rounded-full" />
				<loading-skeleton-indicator class="size-10 rounded-full" />
				<loading-skeleton-indicator class="size-10 rounded-full" />
			</div>
		</loading-skeleton>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	label: {
		label: "Label",
		value: "Loading users…",
	},
});

const userSkeleton = useTemplateGenerator("loading-skeleton-indicator", {
	props: {
		class: {
			value: "size-10 rounded-full",
			isInline: true,
		},
	},
	indent: 1,
});

const additionalContent = useTemplateGenerator("div", {
	props: {
		class: {
			value: "flex flex-wrap gap-1",
			isInline: true,
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

const template = useTemplateGenerator("loading-skeleton", { slots: textSlots, additionalContent });
</script>
