<template>
	<form novalidate data-test="form-wrapper" @submit.prevent="handleFormSubmit">
		<div v-show="haveErrorSummary" ref="errorSummaryElement" tabindex="0" class="mb-4 w-full rounded-sm border border-red-200 bg-red-50 p-4 text-red-800 dark:border-transparent dark:bg-red-500/50 dark:text-red-200" data-test="form-wrapper-error-summary">
			<h2 class="mb-2 font-bold">
				<slot name="error-summary-title">
					There is a problem
				</slot>
			</h2>

			<ul class="list-disc ps-4">
				<li v-for="error in errorSummary" :key="error.id">
					<a :href="`#${error.id}`" class="text-current" data-test="form-wrapper-error-summary-message" @click.prevent="focusField(error.fieldName)">
						{{ error.message }}
					</a>
				</li>
			</ul>
		</div>

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

				<ui-button v-if="haveSubmitButtonLabel" type="submit" class="button--primary" data-test="form-wrapper-submit-button">
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
import { computed, nextTick, provide, reactive, ref, useSlots } from "vue";
import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyObject, isObject } from "@lewishowles/helpers/object";
import { isNonEmptySlot, runComponentMethod } from "@lewishowles/helpers/vue";

const emit = defineEmits(["submit"]);

const slots = useSlots();
// Determine if we have a label. If not, show a warning to the user about
// accessibility.
const haveSubmitButtonLabel = computed(() => isNonEmptySlot(slots["submit-button-label"]));
// Whether we have any tertiary actions to display in the form.
const haveTertiaryActions = computed(() => isNonEmptySlot(slots["tertiary-actions"]));

// The current data for this form, as provided by the fields themselves.
const formData = defineModel({
	type: Object,
	default: () => ({}),
});

// A reference to each of our form fields once registered.
const formFields = reactive({});
// Whether we have any form fields registered to the form.
const haveFormFields = computed(() => isNonEmptyObject(formFields));
// A holding pot for any validation errors found during validation.
const errorSummary = ref([]);
// Whether our error summary contains any errors.
const haveErrorSummary = computed(() => isNonEmptyArray(errorSummary.value));
// The error summary element, allowing us to focus it.
const errorSummaryElement = ref(null);

/**
 * Allow a field to register itself with the form.
 *
 * @param  {string}  field.name
 *     The name of the field to register.
 * @param  {string}  field.id
 *     The ID of the field to register, which helps with linking errors to
 *     fields.
 * @param  {function}  field.validateField
 *     The validation function for this field, run when the form is submitted.
 * @param  {function}  field.focusField
 *     A method to focus on this field, used by the error summary.
 */
async function registerField(field) {
	// If the value bound to the model from the parent isn't an object, set it
	// to one, and wait for the update cycle to complete to ensure that both
	// values are in sync.
	if (!isObject(formData.value)) {
		formData.value = {};

		await nextTick();
	}

	if (Object.hasOwn(formData.value, field.name)) {
		console.error("<form-wrapper>", `Duplicate field name <${field.name}> detected. This only one field with a given name will be represented in form data.`);
	}

	formFields[field.name] = field;
	formData.value[field.name] = null;
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

/**
 * Handle the submit of the form, checking any provided validation, and
 * submitting the appropriate event if validation succeeds.
 */
async function handleFormSubmit() {
	if (!haveFormFields.value) {
		emitSubmit();

		return;
	}

	validateFields();

	if (haveErrorSummary.value) {
		await nextTick();

		runComponentMethod(errorSummaryElement.value, "focus");


		return;
	}

	emitSubmit();
}

/**
 * Validate each field based on its provided validation function. If any errors
 * are encountered, populate the `errorSummary`.
 */
function validateFields() {
	errorSummary.value = [];

	for (const fieldName in formFields) {
		if (!Object.hasOwn(formFields, fieldName)) {
			continue;
		}

		const field = formFields[fieldName];

		if (!isFunction(field.validateField)) {
			continue;
		}

		const validationResult = field.validateField(fieldName, formData.value);

		if (!isNonEmptyArray(validationResult)) {
			continue;
		}

		validationResult.forEach(message => {
			errorSummary.value.push({ fieldName, id: field.id, message });
		});
	}
}

/**
 * Emit a submit event for the parent to handle as necessary. We pass the
 * current form data here just in case its useful in this form.
 */
function emitSubmit() {
	emit("submit", formData.value);
}

/**
 * Trigger focus on the underlying form field.
 *
 * @param  {string}  fieldName
 *     The name of the field to focus.
 */
function focusField(fieldName) {
	if (!Object.hasOwn(formFields, fieldName)) {
		return;
	}

	runComponentMethod(formFields[fieldName], "triggerFocus");
}
</script>
