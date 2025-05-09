import { computed, ref, unref } from "vue";
import { isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";

/**
 * Generate a component template based on the provided text slots.
 *
 * @param  {string}  componentTag
 *     The tag for this component, e.g. `form-field`.
 * @param  {ref}  slots
 *     The slots to add to the component code.
 * @param  {ref}  props
 *     Any additional props to pass to the opening component tag as a `v-model`.
 *     The template will extract the key and `.value` to generate pairs.
 */
export default function useTemplateGenerator(componentTag, slots, props) {
	const template = computed(() => {
		const stableSlots = unref(slots);

		let template = `<${componentTag}${propsTemplate.value}>`;

		template += `\n\t${stableSlots.label?.value || ""}`;

		template += slotsTemplate.value;

		template += `\n</${componentTag}>`;

		return template;
	});

	// Generate a template fragment representing the provided props, extracting
	// each prop's key and ".value" to generate pairs to use in a v-model
	// string.
	const propsTemplate = computed(() => {
		const stableProps = unref(props);

		if (!isNonEmptyObject(stableProps)) {
			return "";
		}

		const propParts = [];

		// For each of our props, we generate a template string and add it
		// to the template, if it contains content.
		for (const propKey in stableProps) {
			if (!Object.prototype.hasOwnProperty.call(stableProps, propKey)) {
				continue;
			}

			// We ignore label, as it follows a different pattern.
			if (propKey === "label") {
				continue;
			}

			const prop = stableProps[propKey];

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
	});

	// Generate a template fragment representing the provided slots.
	const slotsTemplate = computed(() => {
		const stableSlots = unref(slots);

		if (!isNonEmptyObject(stableSlots)) {
			return "";
		}

		let template = "";

		// For each of our text slots, we generate a template string and add it
		// to the template, if it contains content.
		for (const slotKey in stableSlots) {
			if (!Object.prototype.hasOwnProperty.call(stableSlots, slotKey)) {
				continue;
			}

			// We ignore label, as it follows a different pattern.
			if (slotKey === "label") {
				continue;
			}

			const slotContent = stableSlots[slotKey].value;

			if (isNonEmptyString(slotContent)) {
				template += `\n\n\t<template #${slotKey}>\n\t\t${slotContent}\n\t</template>`;
			}
		}

		return template;
	});

	return {
		template,
	};
}
