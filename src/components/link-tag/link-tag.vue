<template>
	<a class="flex items-center gap-2" v-bind="{ href, ...attributes }" data-test="link-tag">
		<component :is="iconStart" v-if="haveIconStart" class="size-[0.857em] stroke-current" />

		<slot />

		<component :is="iconEnd" v-if="shouldShowIconEnd" class="size-[0.857em] stroke-current" />
		<icon-external v-else-if="haveExternalIcon" class="size-[0.857em] stroke-current" />
	</a>
</template>

<script setup>
/**
 * Create a multi-purpose link.
 *
 * Optional icons can be added at either end of the link (`iconStart`,
 * `iconEnd`), using any defined icon in the component library.
 *
 * A link can be marked as `external`, which sets the appropriate `target` and
 * shows an external icon. This icon overrides any defined `iconEnd`, but can be
 * disabled via `showExternalIcon`.
 */
import { computed } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";

const props = defineProps({
	/**
	 * The href for this link.
	 */
	href: {
		type: String,
		required: true,
	},

	/**
	 * Whether this is an external link, which sets target _blank and shows an
	 * external indicator.
	 */
	external: {
		type: Boolean,
		default: false,
	},

	/**
	 * Whether to show the external icon. Only applies if external is true.
	 */
	showExternalIcon: {
		type: Boolean,
		default: true,
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
// Whether an external icon is needed and should be shown.
const haveExternalIcon = computed(() => props.external && props.showExternalIcon);
// Whether to show any defined icon-end. If an external icon is being shown,
// this would override any icon-end.
const shouldShowIconEnd = computed(() => haveIconEnd.value && !haveExternalIcon.value);
// Any additional attributes to apply to the button. For example, aria-live if
// the button is reactive.
const attributes = computed(() => {
	const attributes = {};

	if (props.external) {
		attributes.target = "_blank";
	}

	return attributes;
});
</script>
