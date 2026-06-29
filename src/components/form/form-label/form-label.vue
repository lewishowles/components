<template>
	<alert-message
		v-if="!haveLabel"
		type="error"
		v-bind="{ live: false }"
		data-test="form-label-no-label"
	>
		<template #title>&lt;form-label&gt;</template>

		A label is required for accessibility purposes.
	</alert-message>

	<alert-message
		v-if="missingId"
		type="error"
		v-bind="{ live: false }"
		data-test="form-label-no-id"
	>
		<template #title>&lt;form-label&gt;</template>

		An ID for the corresponding input is required when using the tag `label`.
	</alert-message>

	<component
		:is="tag"
		v-bind="{ for: id, ...$attrs }"
		:class="{ 'sr-only': hidden, 'text-content-strong font-semibold': styled }"
		data-test="form-label"
	>
		<slot />

		<span
			v-if="haveOptionalIndicator"
			class="text-content-muted ms-2 font-normal"
			data-test="form-label-optional-indicator"
		>
			<slot name="optional-indicator">(optional)</slot>
		</span>
	</component>
</template>

<script setup>
/**
 * A label for a form element. This component will show a warning if no label is
 * provided.
 */
import { computed, inject, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";

const props = defineProps({
	/**
	 * The tag to use for the label. Useful when using a label as a legend, for
	 * example.
	 */
	tag: {
		type: String,
		default: "label",
	},

	/**
	 * The ID of the input that this label belongs to.
	 */
	id: {
		type: String,
		default: null,
	},

	/**
	 * Whether the field this label belongs to is required. If not, the label is
	 * augmented with `optional` text.
	 */
	required: {
		type: Boolean,
		default: false,
	},

	/**
	 * Whether this label is visually hidden. Labels are never hidden from
	 * screen readers because of the value they provide.
	 */
	hidden: {
		type: Boolean,
		default: false,
	},

	/**
	 * Whether to show optional text when the field is not required.
	 */
	showOptionalIndicator: {
		type: Boolean,
		default: true,
	},

	/**
	 * Whether to apply styling to the label. This is most useful when using the
	 * label for things like radio labels, where the styling is different.
	 */
	styled: {
		type: Boolean,
		default: true,
	},
});

const slots = useSlots();
// Determine if we have a label. If not, show a warning to the user about
// accessibility.
const haveLabel = computed(() => isNonEmptySlot(slots.default));
// Determine if we have an ID and if one is necessary. If not, show a warning to
// the user about accessibility.
const missingId = computed(() => props.tag === "label" && !isNonEmptyString(props.id));
// The optional indicator is only meaningful inside a form-wrapper, where
// required/optional is a form-submission concept. Standalone fields (search,
// filters) suppress the indicator even when not required.
const formContext = inject("form-wrapper", null);
const haveFormContext = computed(() => formContext !== null);

// Whether to show the optional indicator. Shown when the field is not required,
// inside a form-wrapper, and showOptionalIndicator is not disabled.
const haveOptionalIndicator = computed(
	() => props.showOptionalIndicator && !props.required && haveFormContext.value,
);
</script>

<script>
export default {
	inheritAttrs: false,
};
</script>
