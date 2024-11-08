<template>
	<alert-message v-if="!haveLabel" type="error">
		<template #title>
			&lt;form-label&gt;
		</template>

		A label is required for accessibility purposes.
	</alert-message>

	<alert-message v-if="missingId" type="error">
		<template #title>
			&lt;form-label&gt;
		</template>

		An ID for the corresponding input is required when using the tag `label`.
	</alert-message>

	<component :is="tag" v-bind="{ for: id, ...$attrs }" :class="{ 'sr-only': hidden, 'font-semibold text-grey-950 dark:text-grey-50': styled }" data-test="form-label">
		<slot />

		<template v-if="!required">
			<slot name="optional-indicator">
				(optional)
			</slot>
		</template>
	</component>
</template>

<script setup>
/**
 * A label for a form element. This component will show a warning if no label is
 * provided.
 */
import { computed, useSlots } from "vue";
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
</script>

<script>
export default {
	inheritAttrs: false,
};
</script>
