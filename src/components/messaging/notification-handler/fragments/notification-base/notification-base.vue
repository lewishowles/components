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
					class="mt-2 block text-xs text-grey-500 dark:text-white/60"
					v-bind="{ date: notification.date, locale, format: dateFormat }"
					:data-test="`${dataTest}-date`"
				/>
			</conditional-wrapper>
		</conditional-wrapper>

		<div v-if="showToolbar" class="mt-2 flex items-center gap-4 text-xs" :class="{ 'ps-14': hasImage || hasIcon }" :data-test="`${dataTest}-actions`">
			<link-tag v-if="hasMoreInformationUrl" v-bind="{ href: notification.url, external: true }" :data-test="`${dataTest}-view-more`">
				<slot name="view-more-label">
					View more
				</slot>
			</link-tag>

			<ui-button v-if="canMarkRead" v-bind="{ iconStart: 'icon-check' }" class="button--muted" :data-test="`${dataTest}-mark-read`" @click="markNotificationRead">
				<slot name="mark-read-label">
					Mark as read
				</slot>
			</ui-button>

			<slot name="actions" v-bind="{ notification }" />
		</div>

		<slot name="badge">
			<div class="absolute end-0 top-0" :class="[badgeClasses, 'bg-current size-2 rounded-full me-6 mt-5.5']" :data-test="`${dataTest}-badge`" />
		</slot>
	</div>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { get } from "@lewishowles/helpers/object";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";
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
	 * Whether to allow this notification to be marked as read.
	 */
	allowMarkRead: {
		type: Boolean,
		default: true,
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
		default: "bg-grey-100 dark:bg-white/20",
	},

	/**
	 * Any classes to apply to the box around a displayed icon, which appears to
	 * the left of the notification content.
	 */
	iconBackgroundClasses: {
		type: String,
		default: "bg-grey-50 dark:bg-white/10",
	},

	/**
	 * Any classes to apply to the displayed icon, which appears to the left of
	 * the notification content inside a box.
	 */
	iconClasses: {
		type: String,
		default: "text-grey-500 dark:text-white/80",
	},

	/**
	 * Any classes to apply to the title for this notification.
	 */
	titleClasses: {
		type: String,
		default: "text-grey-950 dark:text-grey-50",
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

const emit = defineEmits(["notification:read"]);
const slots = useSlots();
// The ID for this notification, used to mark it as read.
const notificationId = computed(() => get(props, "notification.id"));
// Whether this notification has an ID.
const hasId = computed(() => isNonEmptyString(notificationId.value));
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
// Whether actions have been provided for this notification.
const haveActions = computed(() => isNonEmptySlot(slots.actions));
// Whether this notification can be marked as read, which requires an ID and
// that this type of notification can be marked read.
const canMarkRead = computed(() => props.allowMarkRead === true && hasId.value === true);
// Whether we should include the toolbar for the notification, including "mark
// read", "view more", etc.
const showToolbar = computed(() => hasMoreInformationUrl.value || canMarkRead.value || haveActions.value);

/**
 * Emit an event requesting that this notification be marked as "read".
 *
 * @param  {string}  notificationId
 *     The ID of the current notification.
 */
function markNotificationRead() {
	if (!canMarkRead.value) {
		return;
	}

	emit("notification:read", notificationId.value);
}
</script>
