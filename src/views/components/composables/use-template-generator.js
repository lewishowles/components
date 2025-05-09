import { computed } from "vue";
import { isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";

/**
 * Generate a component template based on the provided text slots.
 *
 * @param  {string}  componentTag
 *     The tag for this component, e.g. `form-field`.
 * @param  {object}  slots
 *     The slots to add to the component code.
 * @param  {object}  props
 *     Any additional props to pass to the opening component tag as a `v-model`.
 *     The template will extract the key and `.value` to generate pairs.
 */
export default function useTemplateGenerator(componentTag, slots, props) {
	const template = computed(() => {
		let template = `<${componentTag}${generateProps(props)}>`;

		template += `\n\t${slots.label.value}`;

		template += generateSlots(slots);

		template += `\n</${componentTag}>`;

		return template;
	});

	return {
		template,
	};
}

/**
 * Generate a template fragment representing the provided props, extracting each
 * prop's key and ".value" to generate pairs to use in a v-model string.
 *
 * @param  {object}  props
 *     The props to add to the template.
 */
function generateProps(props) {
	if (!isNonEmptyObject(props)) {
		return "";
	}

	const propParts = [];

	// For each of our props, we generate a template string and add it
	// to the template, if it contains content.
	for (const propKey in props) {
		if (!Object.prototype.hasOwnProperty.call(props, propKey)) {
			continue;
		}

		// We ignore label, as it follows a different pattern.
		if (propKey === "label") {
			continue;
		}

		const prop = props[propKey];

		let propContent = prop.value;

		switch (prop.type) {
			case "boolean":
				break;

			default:
				propContent = `'${propContent}'`;

				break;
		}

		if (isNonEmptyString(propContent)) {
			propParts.push(`${propKey}: ${propContent}`);
		}
	}

	return ` v-bind="{ ${propParts.join(", ")} }"`;
}

/**
 * Generate a template fragment representing the provided slots.
 *
 * @param  {object}  slots
 *     The slots from which to generate a template.
 */
function generateSlots(slots) {
	if (!isNonEmptyObject(slots)) {
		return "";
	}

	let template = "";

	// For each of our text slots, we generate a template string and add it
	// to the template, if it contains content.
	for (const slotKey in slots.value) {
		if (!Object.prototype.hasOwnProperty.call(slots.value, slotKey)) {
			continue;
		}

		// We ignore label, as it follows a different pattern.
		if (slotKey === "label") {
			continue;
		}

		const slotContent = slots.value[slotKey].value;

		if (isNonEmptyString(slotContent)) {
			template += `\n\n\t<template #${slotKey}>\n\t\t${slotContent}\n\t</template>`;
		}
	}

	return template;
}
