import { computed, unref } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import useTranslationMode from "@/composables/use-translation-mode/use-translation-mode";

/**
 * Generate a component template based on the provided text slots.
 *
 * @param  {string}  componentTag
 *     The tag for this component, e.g. `form-field`.
 * @param  {object}  options
 *     Additional options
 * @param  {ref}  options.slots
 *     The slots to add to the component code.
 * @param  {ref}  options.props
 *     Any additional props to pass to the opening component tag as a `v-model`.
 *     The template will extract the key and `.value` to generate pairs.
 * @param  {mixed}  options.additionalContent
 *     Any additional content to add to the template (before slots). This can be
 *     a string to be used as-is, or an array of strings. It is recommended to
 *     use the output from another instance of `useTemplateGenerator` if
 *     intending to join multiple components.
 * @param  {number}  options.indent
 *     Whether to indent the output, useful when using the output of this
 *     composable in the content of another component.
 */
export default function useTemplateGenerator(componentTag, { slots = null, props = null, additionalContent = null, indent = 0 } = {}) {
	const { useTranslation, translationPathPrefix } = useTranslationMode();

	const template = computed(() => {
		let template = `<${componentTag}${propsTemplate.value}>`;

		const templateSections = [];

		// Add the default slot, if provided
		const defaultContent = getPlaygroundSlotContent("default");

		if (isNonEmptyString(defaultContent)) {
			templateSections.push(`\t${defaultContent}`);
		}

		// Add any additional content, if provided.
		if (isNonEmptyString(additionalContent)) {
			templateSections.push(`\t${unref(additionalContent)}`);
		}

		if (isNonEmptyArray(additionalContent)) {
			templateSections.push(...additionalContent.map(content => unref(content)));
		}

		if (isNonEmptyArray(slotTemplateSegments.value)) {
			templateSections.push(...slotTemplateSegments.value.map(content => `\t${content}`));
		}

		template += `\n${templateSections.join("\n\n")}`;

		template += `\n</${componentTag}>`;

		// Apply indentation if needed
		return applyIndent(template, indent);
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
	const slotTemplateSegments = computed(() => {
		const stableSlots = unref(slots);

		if (!isNonEmptyObject(stableSlots)) {
			return [];
		}

		let templateSegments = [];

		// For each of our text slots, we generate a template string and add it
		// to the template, if it contains content.
		for (const slotKey in stableSlots) {
			if (!Object.prototype.hasOwnProperty.call(stableSlots, slotKey)) {
				continue;
			}

			// We ignore default, as it follows a different pattern.
			if (slotKey === "default") {
				continue;
			}

			const slotContent = getPlaygroundSlotContent(slotKey);

			if (isNonEmptyString(slotContent)) {
				templateSegments.push(`<template #${slotKey}>\n\t\t${slotContent}\n\t</template>`);
			}
		}

		return templateSegments;
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

		if (!isNonEmptyObject(stableSlots) || !stableSlots[slotKey]) {
			return "";
		}

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

	/**
	 * If an indent is provided, indent the template output each time we
	 * encounter a new line.
	 *
	 * @param  {string}  template
	 *     The template to indent
	 * @param  {number}  indentLevel
	 *     The
	 */
	function applyIndent(template, indentLevel) {
		if (!indentLevel || indentLevel <= 0) {
			return template;
		}

		const tabString = "\t".repeat(indentLevel);

		return `\t${template.replace(/\n(?!\n)/g, `\n${tabString}`)}`;
	}

	return template;
}
