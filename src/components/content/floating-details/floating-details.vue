<template>
	<summary-details v-bind="{ floating: true, closeWithClickOutside: true, align: 'end', summaryClasses, detailsClasses: ['w-screen', detailsClasses, detailsColourClasses, detailsSizeClasses] }" data-test="floating-menu">
		<template #summary>
			<slot name="summary" />
		</template>

		<slot />
	</summary-details>
</template>

<script setup>
defineProps({
	/**
	 * Whether to align to the dropdown to the start or end of the summary. This
	 * is useful for menus that open to the end of the screen, for example.
	 * Anything but "start" will be treated as "end".
	 */
	align: {
		type: String,
		default: "start",
	},

	/**
	 * Any classes to add to the summary element, allowing styling to wrap both
	 * the summary and icons.
	 */
	summaryClasses: {
		type: [String, Array, Object],
		default: "button--muted",
	},

	/**
	 * Any classes to add to the details content.
	 */
	detailsClasses: {
		type: [String, Array, Object],
		default: "mt-3 rounded-md border p-4 shadow",
	},

	/**
	 * Any colours to apply to the details. These are passed as additional
	 * classes, but are separate so that colours can be redefined without
	 * affecting remaining styling.
	 */
	detailsColourClasses: {
		type: [String, Array, Object],
		default: "border-grey-200 bg-white dark:border-transparent dark:bg-grey-950/20 backdrop-blur-lg",
	},

	/**
	 * Any classes to add to specify the details content's size. This is
	 * separate to details classes so that the appearance can be consistent even
	 * if the size is not.
	 */
	detailsSizeClasses: {
		type: [String, Array, Object],
		default: "max-w-lg",
	},
});
</script>
