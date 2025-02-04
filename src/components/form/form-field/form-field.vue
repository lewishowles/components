<template>
	<alert-message v-if="!haveNameIfRequired" type="error">
		<template #title>
			&lt;form-field&gt; &mdash; <slot />
		</template>

		A parent `form-wrapper` was detected, but no `name` was provided for this field.
	</alert-message>

	<component :is="fieldComponent" v-else ref="fieldRef" v-bind="fieldProps" v-model="model">
		<slot />

		<!-- For now, we're listing out slots manually, as one way to
		automatically retrieve them uses Vue internals and seems fragile -->
		<template #introduction>
			<slot name="introduction" />
		</template>
		<template #prefix>
			<slot name="prefix" />
		</template>
		<template #suffix>
			<slot name="suffix" />
		</template>
		<template #options>
			<slot name="options" />
		</template>
		<template #error>
			<slot name="error">
				<ul v-if="haveValidationMessages">
					<li v-for="message in validationMessages" :key="message">
						{{ message }}
					</li>
				</ul>
			</slot>
		</template>
		<template #help>
			<slot name="help" />
		</template>
	</component>
</template>

<script setup>
import { computed, inject, ref, watch } from "vue";
import { deepMerge, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { runComponentMethod } from "@lewishowles/helpers/vue";
import { validateField as validateFormField } from "@lewishowles/helpers/form";
import useInputId from "@/components/form/composables/use-input-id";

const props = defineProps({
	/**
	 * The type of field to display. Known types include:
	 *
	 * text
	 * email
	 * password
	 * textarea
	 * checkbox
	 * radio-group
	 * button-group
	 */
	type: {
		type: String,
		default: null,
	},

	/**
	 * The name of the field. This is required when used within a `form-wrapper`
	 * component, where it is used as the key for the form's data collection. As
	 * such, its uniqueness will be verified by `form-wrapper` when used
	 * together.
	 */
	name: {
		type: String,
		default: null,
	},

	/**
	 * Any validation to apply to the field. This is used with the
	 * externally-facing `validate` function, as well as applying attributes to
	 * the field as necessary such as `required`. For more information
	 * validation types, check the `form-field` docs.
	 */
	validation: {
		type: Array,
		default: () => [],
	},
});

const model = defineModel({
	type: String,
});

// Generate an appropriate input ID.
const { inputId } = useInputId(props.id);
// Retrieve the relevant methods from the wrapper. Form fields may be used
// without a wrapper form, so we provide a default value for our injection in
// case it isn't provided.
const formWrapperInject = inject("form-wrapper", {});
// The injection may not be defined, so we get its properties in a safe way.
const registerField = formWrapperInject?.registerField;
const updateFieldValue = formWrapperInject?.updateFieldValue;
// Whether any validation has been provided for this field.
const haveValidation = computed(() => isNonEmptyArray(props.validation));
// Any validation messages as a result of the latest validation run.
const validationMessages = ref([]);
// Whether we have any validation messages to show.
const haveValidationMessages = computed(() => isNonEmptyArray(validationMessages.value));
// A reference to the field being rendered.
const fieldRef = ref(null);
// The default field type.
const defaultType = "text";
// The default field component to use.
const defaultComponent = "form-input";

// The available field types, including any additional props to pass by default.
const fieldTypes = {
	"text": {},
	"email": { inputAttributes: { type: "email" } },
	"password": { inputAttributes: { type: "password" } },
	"textarea": {},
	"checkbox": {},
	"radio-group": {},
	"button-group": {},
};

// The field type to use, falling back to the default if an unknown type is
// encountered.
const fieldType = computed(() => {
	if (!Object.hasOwn(fieldTypes, props.type)) {
		return defaultType;
	}

	return props.type;
});

// The appropriate component to use, based on the determined field type.
const fieldComponent = computed(() => {
	switch(fieldType.value) {
		case "textarea":
			return "form-textarea";
		case "checkbox":
			return "form-checkbox";
		case "radio-group":
		case "button-group":
			return fieldType.value;
		default:
			return defaultComponent;
	}
});

// Any additional props to pass to the field, including default props and any
// added by validation.
const fieldProps = computed(() => {
	const baseProps = deepMerge({ id: inputId.value }, fieldTypes[fieldType.value]);

	if (!isNonEmptyObject(baseProps) && !haveValidation.value) {
		return null;
	}

	return deepMerge(baseProps, propsForValidation.value);
});

// Any additional props to provide to the input based on current validation
// rules.
const propsForValidation = computed(() => {
	if (!isNonEmptyArray(props.validation)) {
		return {};
	}

	const additionalProps = {};

	props.validation.forEach(rule => {
		switch (rule.rule) {
			case "required":
				additionalProps.required = true;
				additionalProps.inputAttributes = { required: true };

				break;
		}
	});

	return additionalProps;
});

// Whether we detect a parent form.
const haveParentForm = computed(() => isFunction(registerField));

// If we have a parent form, whether we have a required name attribute.
const haveNameIfRequired = computed(() => {
	if (!haveParentForm.value) {
		return true;
	}

	return isNonEmptyString(props.name);
});

watch(model, () => {
	if (isFunction(updateFieldValue)) {
		updateFieldValue(props.name, model.value);
	}
});

// If a parent `form-wrapper` is found, register this field with it.
if (haveParentForm.value) {
	registerField({
		name: props.name,
		id: inputId.value,
		validateField,
		triggerFocus,
	});
}

/**
 * Validate this field for all provided validation rules. We also keep a record
 * of validation messages so that they can be passed down to the field.
 *
 * @param  {string}  fieldName
 *     The name of the field to validate, allowing us to retrieve its value from
 *     the form data.
 * @param  {object}  formData
 *     The current values of each form field.
 */
function validateField(fieldName, formData) {
	validationMessages.value = [];

	if (!haveValidation.value) {
		return true;
	}

	validationMessages.value = validateFormField(fieldName, props.validation, formData);

	return validationMessages.value;
}

/**
 * Trigger focus on the field.
 */
function triggerFocus() {
	runComponentMethod(fieldRef.value, "triggerFocus");
}

defineExpose({
	triggerFocus,
});
</script>
