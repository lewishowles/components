<template>
	<component :is="fieldComponent" ref="fieldRef" v-model="model">
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
			<slot name="error" />
		</template>
		<template #help>
			<slot name="help" />
		</template>
	</component>
</template>

<script setup>
import { computed, ref } from "vue";

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
});

const model = defineModel({
	type: String,
});

// A reference to the field being rendered.
const fieldRef = ref(null);
// The default field type.
const defaultType = "text";
// The default field component to use.
const defaultComponent = "form-input";

// The available field types, including any additional props to pass by default.
const fieldTypes = {
	"text": null,
	"email": { inputAttributes: { type: "email" } },
	"password": { inputAttributes: { type: "password" } },
	"textarea": null,
	"checkbox": null,
	"radio-group": null,
	"button-group": null,
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
</script>
