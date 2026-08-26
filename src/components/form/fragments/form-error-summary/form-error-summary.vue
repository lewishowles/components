<template>
	<div
		v-show="showErrors"
		ref="error-summary"
		tabindex="0"
		class="border-danger-subtle bg-danger-subtle text-danger w-full rounded-sm border px-5 py-3"
		v-bind="{ 'data-test': `${testPrefix}-error-summary` }"
	>
		<h2 class="mbe-2 font-bold">
			<slot name="title">There is a problem</slot>
		</h2>

		<ul class="list-disc ps-4">
			<li v-for="(error, index) in errors" :key="`${error.id}-${index}`">
				<a
					v-if="error.id && error.fieldName"
					:href="`#${error.id}`"
					class="text-current"
					v-bind="{ 'data-test': `${testPrefix}-error-summary-message` }"
					@click.prevent="focusField?.(error.fieldName)"
				>
					{{ error.message }}
				</a>
				<span v-else>{{ error.message }}</span>
			</li>
		</ul>
	</div>
</template>

<script setup>
import { toRefs, useTemplateRef } from "vue";

const props = defineProps({
	/**
	 * Validation error entries to list. An entry with both `id` and
	 * `fieldName` renders as a link to that field; other entries render as
	 * plain text.
	 */
	errors: {
		type: Array,
		default: () => [],
	},

	/**
	 * Called with a field's name when its linked entry is activated, so the
	 * host can focus that field.
	 */
	focusField: {
		type: Function,
		default: null,
	},

	/**
	 * Whether the summary should be shown.
	 */
	showErrors: {
		type: Boolean,
		default: false,
	},

	/**
	 * Prefix used to keep the host component's test hooks stable.
	 */
	testPrefix: {
		type: String,
		required: true,
	},
});

const { errors, focusField, showErrors, testPrefix } = toRefs(props);
const errorSummaryElement = useTemplateRef("error-summary");

/**
 * Focus the error summary when the form host requests it.
 */
function focus() {
	errorSummaryElement.value?.focus?.();
}

defineExpose({ focus });
</script>
