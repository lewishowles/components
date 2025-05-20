<template>
	<div v-if="haveHelp || haveError" class="flex flex-col text-sm">
		<form-error v-if="haveError" v-bind="{ id: errorId }">
			<slot name="error" />
		</form-error>

		<form-help v-if="haveHelp" v-bind="{ id: helpId }">
			<slot name="help" />
		</form-help>
	</div>
</template>

<script setup>
import { computed, useSlots, watch } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";
import useFormSupplementary from "@/components/form/composables/use-form-supplementary";

import FormError from "@/components/form/fragments/form-error/form-error.vue";
import FormHelp from "@/components/form/fragments/form-help/form-help.vue";

const props = defineProps({
	/**
	 * The ID of the input to which this supplementary information belongs.
	 */
	inputId: {
		type: String,
		required: true,
	},
});

const emit = defineEmits(["update:describedby"]);
const slots = useSlots();
const { errorId, helpId } = useFormSupplementary(props.inputId);
// Whether help text has been provided.
const haveHelp = computed(() => isNonEmptySlot(slots.help));
// Whether error text has been provided.
const haveError = computed(() => isNonEmptySlot(slots.error));

// Notify any listening form element to update its describedby value.
watch([haveHelp, haveError], () => {
	emit("update:describedby", { haveHelp: haveHelp.value, haveError: haveError.value });
}, { immediate: true });
</script>
