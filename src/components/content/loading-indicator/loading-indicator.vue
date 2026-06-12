<template>
	<div
		class="flex items-center gap-2"
		v-bind="{ class: { 'flex-col': large }, 'data-large': large || null }"
		role="status"
		aria-live="polite"
		data-component="loading-indicator"
		data-test="loading-indicator"
	>
		<loading-spinner :class="cn({ 'size-7': large }, 'text-content-muted', spinnerClasses)" />

		<slot />
	</div>
</template>

<script setup>
/**
 * `loading-indicator` provides a consistent loading notice and animation when
 * data is pending.
 */
import { cn } from "@/utilities/cn.js";

defineProps({
	/**
	 * Whether to display a larger, vertical version of the indicator.
	 */
	large: {
		type: Boolean,
		default: false,
	},

	/**
	 * Additional classes to apply to the spinner, merged on top of any size
	 * classes set by the large prop. Any provided classes that conflict with
	 * base classes will override as necessary.
	 */
	spinnerClasses: {
		type: [String, Array, Object],
		default: null,
	},
});
</script>
