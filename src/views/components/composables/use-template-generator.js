import { computed } from "vue";
// The code representing the current demonstration.
import { isNonEmptyString } from "@lewishowles/helpers/string";

/**
 * Generate a component template based on the provided text slots.
 */
export default function useTemplateGenerator(componentTag, slots) {
	const template = computed(() => {
		let template = `<${componentTag}>`;

		template += `\n\t${slots.value.label.value}`;

		// For each of our text slots, we generate a template string and add it
		// to the template, if it contains content.
		for (const slotKey in slots.value) {
			if (!Object.prototype.hasOwnProperty.call(slots.value, slotKey)) {
				return;
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

		template += `\n</${componentTag}>`;

		return template;
	});

	return {
		template,
	};
}
