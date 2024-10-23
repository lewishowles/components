<template>
	<span class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset" :class="themeClasses" data-test="pill-badge">
		<component :is="iconStart" v-if="haveIconStart" class="stroke-current" data-test="pill-badge-icon-start" />

		<slot />

		<component :is="iconEnd" v-if="haveIconEnd" class="stroke-current" data-test="pill-badge-icon-end" />
	</span>
</template>

<script setup>
import { computed } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";

const props = defineProps({
	/**
	 * The colour of this badge.
	 *
	 * grey, red, orange, yellow, green, teal, blue, indigo, purple, pink
	 */
	colour: {
		type: String,
		default: "grey",
	},

	/**
	 * An icon to display at the start of the button.
	 */
	iconStart: {
		type: String,
		default: null,
	},

	/**
	 * An icon to display at the end of the button.
	 */
	iconEnd: {
		type: String,
		default: null,
	},
});

// Whether a start icon is defined.
const haveIconStart = computed(() => isNonEmptyString(props.iconStart));
// Whether an end icon is defined.
const haveIconEnd = computed(() => isNonEmptyString(props.iconEnd));

// The classes that make up the chosen colour scheme. We write these out in
// full, rather than composing the classes from the chosen colour, so that
// Tailwind can see the full classes used when it cleans up CSS during build.
const themeClasses = computed(() => {
	switch (props.colour) {
		case "red":
			return "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/50 dark:text-red-200 dark:ring-0";
		case "orange":
			return "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/50 dark:text-orange-200 dark:ring-0";
		case "yellow":
			return "bg-yellow-50 text-yellow-700 ring-yellow-200 dark:bg-yellow-500/50 dark:text-yellow-200 dark:ring-0";
		case "green":
			return "bg-green-50 text-green-700 ring-green-200 dark:bg-green-500/50 dark:text-green-200 dark:ring-0";
		case "teal":
			return "bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-500/50 dark:text-teal-200 dark:ring-0";
		case "blue":
			return "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/50 dark:text-blue-200 dark:ring-0";
		case "indigo":
			return "bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/50 dark:text-indigo-200 dark:ring-0";
		case "purple":
			return "bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-500/50 dark:text-purple-200 dark:ring-0";
		case "pink":
			return "bg-pink-50 text-pink-700 ring-pink-200 dark:bg-pink-500/50 dark:text-pink-200 dark:ring-0";
		default:
			return "bg-grey-50 text-grey-700 ring-grey-200 dark:bg-white/20 dark:text-grey-200 dark:ring-0";
	}
});
</script>
