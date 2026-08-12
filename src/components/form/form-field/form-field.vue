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
		<template #option="{ option, selected, id, name }">
			<slot name="option" v-bind="{ option, selected, id, name }" />
		</template>
		<template #description>
			<slot name="description" />
		</template>
		<template v-if="$slots['empty-option-label']" #empty-option-label>
			<slot name="empty-option-label" />
		</template>
		<template #prefix>
			<slot name="prefix" />
		</template>
		<template #suffix>
			<slot name="suffix" />
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
		<template #remove-button-label="slotProps">
			<slot name="remove-button-label" v-bind="slotProps" />
		</template>
	</component>
</template>

<script setup>
import { computed, inject, onMounted, ref, watch } from "vue";
import { deepMerge, pick } from "@lewishowles/helpers/object";
import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { callComponentMethod } from "@lewishowles/helpers/vue";

import useInputId from "@/components/form/composables/use-input-id/use-input-id";

import FormButtonGroup from "@/components/form/form-button-group/form-button-group.vue";
import FormCheckbox from "@/components/form/form-checkbox/form-checkbox.vue";
import FormCheckboxGroup from "@/components/form/form-checkbox-group/form-checkbox-group.vue";
import FormDate from "@/components/form/form-date/form-date.vue";
import FormFile from "@/components/form/form-file/form-file.vue";
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
	 * button-group
	 * file
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

	/**
	 * Whether to display the label for text, select, and checkbox fields. The
	 * label remains available to screen readers when hidden.
	 */
	displayLabel: {
		type: Boolean,
		default: true,
	},

	/**
	 * Whether a file field allows selecting more than one file. Only applies when
	 * `type` is `file`.
	 */
	multiple: {
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
const isReadonly = formWrapperInject?.isReadonly;
const isFieldRequired = formWrapperInject?.isFieldRequired;

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

// Each field type's component, plus any fixed props it needs and any other
// form-field props it accepts directly and forwards (e.g. file also accepts
// `multiple`).
const fieldTypes = {
	text: {
		component: FormInput,
		forward: ["displayLabel"],
	},
	email: {
		component: FormInput,
		props: { inputAttributes: { type: "email" } },
	},
	password: {
		component: FormInput,
		props: { inputAttributes: { type: "password" } },
	},
	date: {
		component: FormDate,
	},
	file: {
		component: FormFile,
		forward: ["multiple"],
	},
	textarea: {
		component: FormTextarea,
	},
	checkbox: {
		component: FormCheckbox,
		forward: ["displayLabel"],
	},
	"checkbox-group": {
		component: FormCheckboxGroup,
		forward: ["name"],
	},
	"radio-group": {
		component: FormRadioGroup,
		forward: ["name"],
	},
	"button-group": {
		component: FormButtonGroup,
	},
	select: {
		component: FormSelect,
		forward: ["displayLabel"],
	},
};

// The field type to use, falling back to the default if an unknown type is
// encountered.
const fieldType = computed(() => {
	if (!Object.hasOwn(fieldTypes, props.type)) {
		return defaultType;
	}

	return props.type;
});

// The config for the resolved field type.
const fieldConfiguration = computed(() => fieldTypes[fieldType.value]);

// The appropriate component to use, based on the determined field type.
const fieldComponent = computed(() => {
	return fieldConfiguration.value.component;
});

// Whether this field should be marked required, from an explicit prop or a
// `required` rule cascaded from the parent form-wrapper.
const isRequired = computed(() => {
	if (props.required) {
		return true;
	}

	return isFunction(isFieldRequired) && isFieldRequired(props.name);
});

// Any additional props to pass to the field, including default props, required
// state, and any provided directly.
const fieldProps = computed(() => {
	const attributeGroups = [
		{ id: inputId.value },
		fieldConfiguration.value.props,
		pick(props, fieldConfiguration.value.forward),
	];

	if (isRequired.value) {
		attributeGroups.push({ required: true });
	}

	if (props.inputAttributes) {
		attributeGroups.push({ inputAttributes: props.inputAttributes });
	}

	// Cascade form-wrapper readonly to child fields.
	if (isReadonly?.value) {
		attributeGroups.push({ readonly: true });
	}

	return deepMerge(...attributeGroups);
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
			triggerFocus,
		});
	}
});

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
