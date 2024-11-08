<template>
	<form>
		<slot name="pre-form" />

		<form-layout>
			<slot />

			<form-actions>
				<alert-message v-if="!haveSubmitButtonLabel" type="error" data-test="form-wrapper-submit-button-label-error">
					<template #title>
						&lt;form-wrapper&gt;
					</template>

					<p>The slot <code>`submit-button-label`</code> is required to provide a meaningful call to action for the form.</p>
				</alert-message>

				<ui-button v-if="haveSubmitButtonLabel" type="submit" class="button--primary">
					<slot name="submit-button-label" />
				</ui-button>

				<slot name="secondary-actions" />

				<div v-if="haveTertiaryActions" class="w-full">
					<slot name="tertiary-actions" />
				</div>
			</form-actions>
		</form-layout>
	</form>
</template>

<script setup>
import { computed, nextTick, provide, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";
import { isObject } from "@lewishowles/helpers/object";

// The current data for this form, as provided by the fields themselves.
const formData = defineModel({
	type: Object,
	default: () => ({}),
});

const slots = useSlots();
// Determine if we have a label. If not, show a warning to the user about
// accessibility.
const haveSubmitButtonLabel = computed(() => isNonEmptySlot(slots["submit-button-label"]));
// Whether we have any tertiary actions to display in the form.
const haveTertiaryActions = computed(() => isNonEmptySlot(slots["tertiary-actions"]));

/**
 * Allow a field to register itself with the form.
 *
 * @param  {string}  name
 *     The name of the field to register.
 */
async function registerField(name) {
	// If the value bound to the model from the parent isn't an object, set it
	// to one, and wait for the update cycle to complete to ensure that both
	// values are in sync.
	if (!isObject(formData.value)) {
		formData.value = {};

		await nextTick();
	}

	if (Object.hasOwn(formData.value, name)) {
		console.error("<form-wrapper>", `Duplicate field name <${name}> detected. This only one field with a given name will be represented in form data.`);
	}

	formData.value[name] = null;
}

/**
 * Allow a field to update its value in the form.
 *
 * @param  {string}  name
 *     The name of the field to update.
 * @param  {unknown}  value
 *     The value to set.
 */
async function updateFieldValue(name, value) {
	formData.value[name] = value;
}

provide("form-wrapper", {
	registerField,
	updateFieldValue,
});
</script>
