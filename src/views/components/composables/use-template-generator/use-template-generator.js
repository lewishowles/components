import { computed, unref } from "vue";
import { isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import useTranslationMode from "@/composables/use-translation-mode/use-translation-mode";

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
	const { useTranslation, translationPathPrefix } = useTranslationMode();

	const template = computed(() => {
		let template = `<${componentTag}${propsTemplate.value}>`;

		template += `\n\t${getPlaygroundSlotContent("label")}`;

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
				case "select":
					// We set this to null so that the prop is defined as just a
					// variable, which is how it would be defined in most
					// occasions. This allows the playground to define real
					// options, for example, that don't show up in the template
					// and just need to be removed.
					propContent = null;

					break;
				default:
					propContent = `'${propContent}'`;

					break;
			}

			if (isNonEmptyString(propContent)) {
				propParts.push(`${propKey}: ${propContent}`);
			} else {
				propParts.push(`${propKey}`);
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

			const slotContent = getPlaygroundSlotContent(slotKey);

			if (isNonEmptyString(slotContent)) {
				template += `\n\n\t<template #${slotKey}>\n\t\t${slotContent}\n\t</template>`;
			}
		}

		return template;
	});

	/**
	 * Retrieve the appropriate slot content for a given slot key; either raw
	 * content, or a vue-i18n ready translation string.
	 *
	 * @param  {string}  slotKey
	 *     The key of the slot for which to retrieve slot content.
	 */
	function getPlaygroundSlotContent(slotKey) {
		const stableSlots = unref(slots);

		// If we're using translation mode, we return a vue-i18n ready
		// translation, combining any translationPathPrefix with the key for
		// the slot.
		if (useTranslation.value) {
			let slotContent = [translationPathPrefix.value, slotKey].filter(pathPart => pathPart).join(".");

			slotContent = `{{ t("${slotContent}") }}`;

			return slotContent;
		}

		return stableSlots[slotKey].value;
	}

	return {
		template,
	};
}
