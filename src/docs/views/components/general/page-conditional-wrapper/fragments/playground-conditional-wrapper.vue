<template>
	<component-playground v-bind="{ copy: template }" id="playground-conditional-wrapper" v-model="textSlots">
		<template #title>
			Conditional wrapper
		</template>

		<template #introduction>
			<p />
		</template>

		<ui-button class="button--muted mb-4" @click="shouldWrap = !shouldWrap">
			<template v-if="!shouldWrap">
				Wrap
			</template>
			<template v-else>
				Unwrap
			</template>
		</ui-button>

		<conditional-wrapper v-bind="componentProps">
			<div>Inner peace</div>
		</conditional-wrapper>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Whether the conditional wrapper should be active.
const shouldWrap = ref(true);

const slots = {
	default: {
		value: [useTemplateGenerator("div", { slots: { default: { value: "Inner peace" } } })],
	},
};

// Props both for the template and for the component example itself.
const props = ref({
	wrap: {
		label: "Wrap",
		value: shouldWrap,
		type: "boolean",
	},
	class: {
		label: "Class",
		value: "bg-purple-50 px-4 py-2 rounded-lg text-purple-800",
		isInline: true,
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("conditional-wrapper", { slots, props });
</script>
