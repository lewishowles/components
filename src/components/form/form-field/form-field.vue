<template>
	<alert-message v-if="!haveNameIfRequired" type="error">
		<template #title>
			&lt;form-field&gt; &mdash;
			<slot />
		</template>

		A parent `form-wrapper` was detected, but no `name` was provided for this field.
	</alert-message>

	<component :is="fieldComponent" v-else ref="fieldRef" v-bind="fieldProps" v-model="model">
		<slot />

		<!-- For now, we're listing out slots manually, as one way to
		automatically retrieve them uses Vue internals and seems fragile -->
		<template #optional-indicator>
			<slot name="optional-indicator" />
		</template>
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
				<ul v-if="haveFieldMessages">
					<li v-for="(message, index) in fieldMessages" :key="`${message}-${index}`">
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
import { computed, inject, onMounted, ref, watch } from "vue";
import { deepMerge, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { callComponentMethod } from "@lewishowles/helpers/vue";
import { validateField as validateFormField } from "@lewishowles/helpers/form";

import useInputId from "@/components/form/composables/use-input-id/use-input-id";

import FormButtonGroup from "@/components/form/form-button-group/form-button-group.vue";
import FormCheckbox from "@/components/form/form-checkbox/form-checkbox.vue";
import FormCheckboxGroup from "@/components/form/form-checkbox-group/form-checkbox-group.vue";
import FormDate from "@/components/form/form-date/form-date.vue";
import FormInput from "@/components/form/form-input/form-input.vue";
import FormRadioGroup from "@/components/form/form-radio-group/form-radio-group.vue";
import FormSelect from "@/components/form/form-select/form-select.vue";
import FormTextarea from "@/components/form/form-textarea/form-textarea.vue";

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
	 * checkbox-group
	 * form-button-group
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

	/**
	 * Any additional attributes to pass to the input itself, such as
	 * `autocomplete` or `aria-labelledby`.
	 */
	inputAttributes: {
		type: Object,
		default: null,
	},

	/**
	 * Whether this field is required. When `true`, the `required` attribute is
	 * added to the underlying input. This is also set automatically when a
	 * `required` validation rule is present.
	 */
	required: {
		type: Boolean,
		default: false,
	},
});

const model = defineModel();

// Generate an appropriate input ID.
const { inputId } = useInputId(props.id);
// Retrieve the relevant methods from the wrapper. Form fields may be used
// without a wrapper form, so we provide a default value for our injection in
// case it isn't provided.
const formWrapperInject = inject("form-wrapper", {});
// The injection may not be defined, so we get its properties in a safe way.
const fieldErrorsFor = formWrapperInject?.fieldErrorsFor;
const registerField = formWrapperInject?.registerField;
const updateFieldValue = formWrapperInject?.updateFieldValue;
// Whether any validation has been provided for this field.
const haveValidation = computed(() => isNonEmptyArray(props.validation));

// All error messages for this field, sourced from the wrapper's single merge
// point. Returns an empty array when the field is used outside form-wrapper.
const fieldMessages = computed(() => {
	if (!isFunction(fieldErrorsFor)) {
		return [];
	}

	return fieldErrorsFor(props.name);
});

// Whether we have any field messages to show.
const haveFieldMessages = computed(() => isNonEmptyArray(fieldMessages.value));
// A reference to the field being rendered.
const fieldRef = ref(null);
// The default field type.
const defaultType = "text";
// The default field component to use.
const defaultComponent = FormInput;

// Field controls bundled with `form-field`, so automatic imports do not depend
// on global registration.
const fieldComponents = {
	"form-button-group": FormButtonGroup,
	checkbox: FormCheckbox,
	"checkbox-group": FormCheckboxGroup,
	date: FormDate,
	select: FormSelect,
	"radio-group": FormRadioGroup,
	textarea: FormTextarea,
};

// The available field types, including any additional props to pass by default.
const fieldTypes = {
	text: {},
	email: { inputAttributes: { type: "email" } },
	password: { inputAttributes: { type: "password" } },
	date: {},
	textarea: {},
	checkbox: {},
	"checkbox-group": {},
	"radio-group": {},
	"form-button-group": {},
	select: {},
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
	return fieldComponents[fieldType.value] ?? defaultComponent;
});

// Any additional props to pass to the field, including default props, any added
// by validation, and any provided directly.
const fieldProps = computed(() => {
	const baseProps = deepMerge({ id: inputId.value }, fieldTypes[fieldType.value]);

	if (!isNonEmptyObject(baseProps) && !haveValidation.value) {
		return null;
	}

	const attributeGroups = [baseProps, propsForValidation.value];

	if (props.inputAttributes) {
		attributeGroups.push({ inputAttributes: props.inputAttributes });
	}

	return deepMerge(...attributeGroups);
});

// Any additional props to provide to the input based on current validation
// rules.
const propsForValidation = computed(() => {
	const additionalProps = {};

	// Explicit `required` prop takes effect directly.
	if (props.required) {
		additionalProps.required = true;
	}

	// Auto-detect `required` from validation rules.
	if (isNonEmptyArray(props.validation)) {
		props.validation.forEach((rule) => {
			if (rule.rule === "required") {
				additionalProps.required = true;
			}
		});
	}

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

// If a parent `form-wrapper` is found, register this field with it. We wait
// until mounted so that composite fields (e.g. form-date) have had a chance
// to render and expose their focusId.
onMounted(() => {
	if (haveParentForm.value) {
		registerField({
			name: props.name,
			id: fieldRef.value?.focusId ?? inputId.value,
			validateField,
			triggerFocus,
		});
	}
});

/**
 * Validate this field for all provided validation rules. Returns the error
 * messages so form-wrapper can store them centrally.
 *
 * @param  {string}  fieldName
 *     The name of the field to validate, allowing us to retrieve its value from
 *     the form data.
 * @param  {object}  formData
 *     The current values of each form field.
 */
function validateField(fieldName, formData) {
	if (!haveValidation.value) {
		return true;
	}

	const { errors } = validateFormField(fieldName, props.validation, formData);

	return errors;
}

/**
 * Trigger focus on the field.
 */
function triggerFocus() {
	callComponentMethod(fieldRef.value, "triggerFocus");
}

defineExpose({
	triggerFocus,
});
</script>
