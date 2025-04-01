<template>
	<div class="relative py-4 ps-8 pe-12" :data-test="dataTest">
		<div class="absolute inset-y-0 start-0 w-1 rounded-full" :class="stripeClasses" :data-test="`${dataTest}-stripe`" />

		<conditional-wrapper v-bind="{ wrap: hasImage || hasIcon }" class="flex items-start gap-4">
			<image-tag v-if="hasImage" :src="notification.image_url" class="size-10 rounded-md object-cover" :data-test="`${dataTest}-image`" />

			<div v-else-if="hasIcon" class="w-10 rounded-md p-3" :class="iconBackgroundClasses" :data-test="`${dataTest}-icon`">
				<component :is="notification.icon" class="size-4.5" :class="iconClasses" />
			</div>

			<conditional-wrapper v-bind="{ wrap: hasImage || hasIcon }">
				<h3 v-if="hasTitle" class="font-semibold" :class="titleClasses" :data-test="`${dataTest}-title`">
					{{ notification.title }}
				</h3>

				<div :class="textClasses">
					{{ notification.message }}
				</div>

				<display-date
					v-if="hasDate"
					class="mt-2 block text-xs text-grey-500"
					v-bind="{ date: notification.date, locale, format: dateFormat }"
					:data-test="`${dataTest}-date`"
				/>
			</conditional-wrapper>
		</conditional-wrapper>

		<link-tag v-if="hasMoreInformationUrl" class="mt-2" v-bind="{ href: notification.url, external: true }" :data-test="`${dataTest}-view-more`">
			<slot name="view-more-label">
				View more
			</slot>
		</link-tag>

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
		default: null,
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
	 * Any classes to apply to the box around a displayed icon, which appears to
	 * the left of the notification content.
	 */
	iconBackgroundClasses: {
		type: String,
		default: "bg-grey-50",
	},

	/**
	 * Any classes to apply to the displayed icon, which appears to the left of
	 * the notification content inside a box.
	 */
	iconClasses: {
		type: String,
		default: "text-grey-500",
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
// Whether this notification has a date.
const hasDate = computed(() => isNonEmptyString(get(props, "notification.date")));
// Whether this notification has an image to display.
const hasImage = computed(() => isNonEmptyString(get(props, "notification.image_url")));
// Whether this notification has an icon to display.
const hasIcon = computed(() => isNonEmptyString(get(props, "notification.icon")));
// Whether this notification a URL to view more information.
const hasMoreInformationUrl = computed(() => isNonEmptyString(get(props, "notification.url")));
</script>
