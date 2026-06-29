<template>
	<div data-component="form-fieldset" data-test="form-fieldset">
		<div class="border-border mb-6 flex flex-col gap-4 border-b pb-6">
			<component :is="headingLevel" :class="resolvedTitleClasses">
				<slot name="title" />
			</component>

			<slot name="introduction" />
		</div>

		<form-layout v-bind="{ class: layoutClasses }">
			<slot />
		</form-layout>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { cn } from "@/utilities/cn.js";

const props = defineProps({
	/**
	 * The heading level to use for this fieldset.
	 */
	headingLevel: {
		type: String,
		default: "h2",
	},

	/**
	 * Additional classes to apply to the title, merged on top of the title's
	 * base styles. Any provided classes that conflict with base classes will
	 * override as necessary.
	 */
	titleClasses: {
		type: [String, Array, Object],
		default: null,
	},

	/**
	 * Additional classes to pass to the inner form-layout, merged via `cn` to
	 * resolve Tailwind conflicts. Useful for overriding the default gap.
	 */
	layoutClasses: {
		type: String,
		default: "",
	},
});

// The resolved title classes, merging the base title styles with any user
// overrides.
const resolvedTitleClasses = computed(() =>
	cn("text-content-strong text-3xl font-bold", props.titleClasses),
);
</script>
