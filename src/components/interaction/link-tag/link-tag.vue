<template>
	<a
		ref="anchorElement"
		class="inline-block"
		v-bind="{ href, ...attributes }"
		data-component="link-tag"
		:data-external="external || null"
		data-test="link-tag"
	>
		<component
			:is="iconStartComponent"
			v-if="haveIconStart"
			class="inline-block stroke-current"
			:class="{
				'size-text': iconOnly && !showExternalIcon,
				'me-1 size-[0.857em]': !iconOnly || showExternalIcon,
			}"
			data-part="icon-start"
			data-test="link-tag-icon-start"
		/>

		<conditional-wrapper
			v-bind="{ wrap: iconOnly, tag: 'span' }"
			class="sr-only"
			data-part="label"
			data-test="link-tag-label"
		>
			<slot />
		</conditional-wrapper>

		<component
			:is="iconEndComponent"
			v-if="shouldShowIconEnd"
			class="inline-block stroke-current"
			:class="{
				'size-text': iconOnly && !showExternalIcon,
				'ms-1 size-[0.857em]': !iconOnly || showExternalIcon,
			}"
			data-part="icon-end"
			data-test="link-tag-icon-end"
		/>
		<icon-external
			v-else-if="haveExternalIcon"
			class="ms-1 inline-block size-[0.857em] stroke-current"
			data-part="icon-external"
			data-test="link-tag-icon-external"
		/>

		<span
			v-if="external"
			class="sr-only"
			data-part="external-suffix"
			data-test="link-tag-external-suffix"
		>
			<slot name="external-suffix">(opens in new tab)</slot>
		</span>
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
import { computed, useTemplateRef } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { resolveIconComponent } from "@/utilities/resolve-icon-component/resolve-icon-component.js";
import { runComponentMethod } from "@lewishowles/helpers/vue";

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

	/**
	 * Only display an icon (with "sr-only" text)
	 */
	iconOnly: {
		type: Boolean,
		default: false,
	},
});

// The anchor element itself.
const anchorElement = useTemplateRef("anchorElement");
// Whether a start icon is defined.
const haveIconStart = computed(() => isNonEmptyString(props.iconStart));
// Whether an end icon is defined.
const haveIconEnd = computed(() => isNonEmptyString(props.iconEnd));
// The resolved component for the start icon.
const iconStartComponent = computed(() => resolveIconComponent(props.iconStart));
// The resolved component for the end icon.
const iconEndComponent = computed(() => resolveIconComponent(props.iconEnd));
// Whether an external icon is needed and should be shown.
const haveExternalIcon = computed(() => props.external && props.showExternalIcon);
// Whether to show any defined icon-end. If an external icon is being shown,
// this would override any icon-end.
const shouldShowIconEnd = computed(() => haveIconEnd.value && !haveExternalIcon.value);

// Any additional attributes to apply to the link.
const attributes = computed(() => {
	const attributes = {};

	if (props.external) {
		attributes.target = "_blank";
		attributes.rel = "noopener noreferrer";
	}

	return attributes;
});

/**
 * Trigger focus on this link.
 */
function triggerFocus() {
	runComponentMethod(anchorElement.value, "focus");
}

defineExpose({
	triggerFocus,
});
</script>
