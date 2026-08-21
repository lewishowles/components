<template>
	<div data-component="form-fieldset" data-test="form-fieldset">
		<div :class="headerClass">
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
import { computed, inject } from "vue";
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

const { isCompact } = inject("form", {});

const headerClass = computed(() =>
	cn("border-border flex flex-col border-b", isCompact?.value ? "mb-4 pb-4" : "mb-6 pb-6 gap-4"),
);

const resolvedTitleClasses = computed(() =>
	cn(
		"text-content-strong font-bold",
		isCompact?.value ? "text-xl" : "text-3xl",
		props.titleClasses,
	),
);
</script>
