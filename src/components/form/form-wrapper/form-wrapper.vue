<template>
	<form>
		<form-layout>
			<slot />
		</form-layout>
	</form>
</template>

<script setup>
import { isObject } from "@lewishowles/helpers/object";
import { nextTick, provide } from "vue";

// The current data for this form, as provided by the fields themselves.
const formData = defineModel({
	type: Object,
	default: () => ({}),
});

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
