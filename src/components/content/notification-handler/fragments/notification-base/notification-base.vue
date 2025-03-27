<template>
	<div class="relative py-4 ps-8 pe-12" data-test="notification-info">
		<div class="absolute inset-y-0 start-0 w-1 rounded-full" :class="stripeClasses" />

		<div :class="textClasses">
			{{ notification.message }}
		</div>

		<div class="absolute end-0 top-0 me-6 mt-5.5 size-2 rounded-full" :class="badgeClasses" />
	</div>
</template>

<script setup>
defineProps({
	/**
	 * The details of the notification to display.
	 */
	notification: {
		type: Object,
		default: () => ({}),
	},

	/**
	 * Any classes to apply to the "stripe", which appears to the left of the
	 * notification.
	 */
	stripeClasses: {
		type: String,
		default: null,
	},

	/**
	 * Any classes to apply to the text of the notification itself.
	 */
	textClasses: {
		type: String,
		default: null,
	},

	/**
	 * Any classes to apply to the "badge", which appears to the right of the
	 * notification.
	 */
	badgeClasses: {
		type: String,
		default: null,
	},
});
</script>
