<template>
	<div class="relative py-4 ps-8 pe-12" :data-test="dataTest">
		<div class="absolute inset-y-0 start-0 w-1 rounded-full" :class="stripeClasses" :data-test="`${dataTest}-stripe`" />

		<h3 v-if="hasTitle" class="font-semibold" :class="titleClasses" :data-test="`${dataTest}-title`">
			{{ notification.title }}
		</h3>

		<div :class="textClasses">
			{{ notification.message }}
		</div>

		<div class="absolute end-0 top-0 me-6 mt-5.5 size-2 rounded-full" :class="badgeClasses" :data-test="`${dataTest}-badge`" />
	</div>
</template>

<script setup>
import { computed } from "vue";
import { get } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";

const props = defineProps({
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
		default: "bg-grey-100",
	},

	/**
	 * Any classes to apply to the title for this notification.
	 */
	titleClasses: {
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
		default: "bg-grey-500",
	},

	/**
	 * The data-test attribute, which is used to customise this notification for
	 * testing.
	 */
	dataTest: {
		type: String,
		default: "notification-base",
	},
});

// Whether this notification has a title.
const hasTitle = computed(() => isNonEmptyString(get(props, "notification.title")));
</script>
