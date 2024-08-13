<template>
	<button type="button" class="flex items-center gap-2" data-test="ui-button">
		<component :is="iconStart" v-if="haveIconStart" class="size-[0.857em] stroke-current" />

		<slot />

		<component :is="iconEnd" v-if="haveIconEnd" class="size-[0.857em] stroke-current" />
	</button>
</template>

<script setup>
import { computed } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";

const props = defineProps({
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
</script>
