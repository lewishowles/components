<template>
	<alert-message
		v-if="showErrors"
		ref="general-errors"
		type="error"
		v-bind="{ 'data-test': `${testPrefix}-general-errors` }"
	>
		<slot name="submit-errors" v-bind="{ errors }">
			<ul v-if="errors.length > 1" class="list-disc ps-4">
				<li v-for="(error, index) in errors" :key="index">{{ error }}</li>
			</ul>
			<p v-else>{{ errors[0] }}</p>
		</slot>
	</alert-message>

	<alert-message
		v-if="status?.message"
		v-bind="{ type: status.type, showIcon: false, 'data-test': `${testPrefix}-status` }"
		class="mbe-4"
	>
		<template v-if="Array.isArray(status.message)">
			<p v-for="(message, index) in status.message" :key="index">{{ message }}</p>
		</template>
		<template v-else>{{ status.message }}</template>
	</alert-message>
</template>

<script setup>
import { toRefs, useTemplateRef } from "vue";

const props = defineProps({
	/**
	 * General submit errors to render when no field owns the error.
	 */
	errors: {
		type: Array,
		default: () => [],
	},

	/**
	 * Whether the general error alert should be shown, including custom slot content.
	 */
	showErrors: {
		type: Boolean,
		default: false,
	},

	/**
	 * Form status feedback to render beside the action buttons.
	 */
	status: {
		type: Object,
		default: null,
	},

	/**
	 * Prefix used to keep the host component's test hooks stable.
	 */
	testPrefix: {
		type: String,
		required: true,
	},
});

const { errors, showErrors, status, testPrefix } = toRefs(props);
const generalErrorsElement = useTemplateRef("general-errors");

/**
 * Focus the general submit-error alert when the form host requests it.
 */
function focus() {
	generalErrorsElement.value?.focus?.();
}

defineExpose({ focus });
</script>
