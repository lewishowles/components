<template>
	<notification-base
		v-bind="{
			notification,
			allowMarkRead: false,
			locale,
			dateFormat,
			stripeClasses: 'bg-primary-text',
			iconBackgroundClasses: 'bg-primary-subtle',
			iconClasses: 'text-primary',
			badgeClasses: 'text-primary',
		}"
		data-test="notification-pinned"
	>
		<template #view-more-label>
			<slot name="view-more-label" />
		</template>

		<template #actions="slotParameters">
			<slot name="actions" v-bind="slotParameters || {}" />
		</template>

		<template #badge>
			<icon-pin
				class="text-primary absolute end-0 top-0 me-5 mt-4.5 size-4"
				data-test="notification-pinned-badge"
			/>
		</template>
	</notification-base>
</template>

<script setup>
import NotificationBase from "../notification-base/notification-base.vue";

defineProps({
	/**
	 * The details of the notification to display.
	 */
	notification: {
		type: Object,
		default: () => ({}),
	},

	/**
	 * The locale to use when displaying dates.
	 */
	locale: {
		type: String,
		default: undefined,
	},

	/**
	 * The date format to use in the display of the date. To reset to the user's
	 * locale settings, set the format to null.
	 */
	dateFormat: {
		type: Object,
		default: undefined,
	},
});
</script>
