import { computed, unref } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { isNumber } from "@lewishowles/helpers/number";
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
 * @param  {ref}  options.events
 *     Any additional events to pass to apply to the opening component tag.
 *     The template will extract the key and `.value` to generate pairs.
 * @param  {mixed}  options.additionalContent
 *     Any additional content to add to the template (after slots). This can be
 *     a string to be used as-is, or an array of strings. It is recommended to
 *     use the output from another instance of `useTemplateGenerator` if
 *     intending to join multiple components.
 * @param  {number}  options.indent
 *     Whether to indent the output, useful when using the output of this
 *     composable in the content of another component.
 */
export default function useTemplateGenerator(componentTag, { slots = null, props = null, events = null, additionalContent = null, indent = 0 } = {}) {
	const { useTranslation, translationPathPrefix } = useTranslationMode();

	const template = computed(() => {
		let internalDefaultContent = getPlaygroundSlotContent("default");
		let internalAdditionalContent = getStandardisedContentString(additionalContent);

		const haveSlots = isNonEmptyObject(slots);
		const haveDefaultContent = isNonEmptyString(internalDefaultContent);
		const haveAdditionalContent = isNonEmptyString(internalAdditionalContent);

		// If this is an empty component, render it as self-closing.
		if (!haveDefaultContent && !haveSlots && !haveAdditionalContent) {
			return applyIndent(`<${componentTag}${propsTemplate.value}${eventsTemplate.value} />`, indent);
		}

		let template = `<${componentTag}${propsTemplate.value}${eventsTemplate.value}>`;

		const templateSections = [];

		// Add the default slot content, if provided
		if (haveDefaultContent) {
			// If the content is itself a component, its indentation needs to be
			// handled differently to if it's just text, because a component
			// will be indented as a whole.
			if (!internalDefaultContent.startsWith("\t")) {
				internalDefaultContent = applyIndent(internalDefaultContent, 1);
			}

			templateSections.push(internalDefaultContent);
		}

		// Add any existing slot templates.
		if (isNonEmptyArray(slotTemplateSegments.value)) {
			templateSections.push(...slotTemplateSegments.value.map(content => `\t${content}`));
		}

		// Add any existing additional content.
		if (isNonEmptyString(internalAdditionalContent)) {
			templateSections.push(internalAdditionalContent);
		}

		template += `\n${getStandardisedContentString(templateSections)}`;

		template += `\n</${componentTag}>`;

		// Apply indentation if needed
		return applyIndent(template, indent);
	});

	// Generate a template fragment representing the provided props, extracting
	// each prop's key and ".value" to generate pairs to use in a v-bind string.
	const propsTemplate = computed(() => {
		const stableProps = unref(props);

		if (!isNonEmptyObject(stableProps)) {
			return "";
		}

		// Props that will appear inline, e.g. name="name"
		const inlineProps = [];
		// Props that will appear in a bind, e.g. v-bind="{ name: 'name' }"
		const boundProps = [];

		// For each of our props, we generate a template string and add it
		// to the template, if it contains content.
		for (const propKey in stableProps) {
			if (!Object.prototype.hasOwnProperty.call(stableProps, propKey)) {
				continue;
			}

			const prop = stableProps[propKey];
			const isPropInline = prop.inline === true;

			let propContent = prop.value;

			switch (prop.type) {
				case "boolean":
					break;
				case "select":
				case "object":
				case "array":
					// We set this to null so that the prop is defined as just a
					// variable, which is how it would be defined in most
					// occasions. This allows the playground to define real
					// options, for example, that don't show up in the template
					// and just need to be removed.
					propContent = null;

					break;
				default:
					// If the prop is inline, we don't want to wrap it in
					// further quotes.
					if (!isPropInline) {
						propContent = `'${propContent}'`;
					}

					break;
			}

			if (propContent !== null) {
				if (isPropInline === true) {
					inlineProps.push(`${propKey}="${propContent}"`);

					continue;
				}

				boundProps.push(`${propKey}: ${propContent}`);
			} else {
				boundProps.push(`${propKey}`);
			}
		}

		const propsStringPieces = [];

		if (isNonEmptyArray(inlineProps)) {
			propsStringPieces.push(...inlineProps);
		}

		if (isNonEmptyArray(boundProps)) {
			propsStringPieces.push(`v-bind="{ ${boundProps.join(", ")} }"`);
		}

		if (!isNonEmptyArray(propsStringPieces)) {
			return "";
		}

		return ` ${propsStringPieces.join(" ")}`;
	});

	// Generate a template fragment representing the provided events, extracting
	// each event's key and ".value" to generate pairs.
	const eventsTemplate = computed(() => {
		const stableEvents = unref(events);

		if (!isNonEmptyObject(stableEvents)) {
			return "";
		}

		const inlineEvents = [];

		// For each of our props, we generate a template string and add it to
		// the template, if it contains content.
		for (const eventKey in stableEvents) {
			if (!Object.prototype.hasOwnProperty.call(stableEvents, eventKey)) {
				continue;
			}

			const event = stableEvents[eventKey];
			const eventContent = event.value;

			if (isNonEmptyString(eventContent)) {
				inlineEvents.push(`@${eventKey}="${eventContent}"`);
			}
		}

		if (!isNonEmptyArray(inlineEvents)) {
			return "";
		}

		return ` ${inlineEvents.join(" ")}`;
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

			let slotContent = getPlaygroundSlotContent(slotKey);

			if (isNonEmptyString(slotContent)) {
				// Similar to default content, if the content is itself a
				// component, its indentation needs to be handled differently to
				// if it's just text, because a component should be generated
				// using this method, and indented appropriately.
				if (!slotContent.startsWith("\t")) {
					slotContent = `\t${slotContent}`;
				}

				templateSegments.push(`<template #${slotKey}>\n\t${slotContent}\n\t</template>`);
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

		return getStandardisedContentString(stableSlots[slotKey].value);
	}

	/**
	 * Get a standardised form of the given content, converting refs or arrays
	 * as necessary.
	 *
	 * @param  {array|string|ref}  content
	 *     The provided content to standardise.
	 */
	function getStandardisedContentString(content) {
		const stableContent = unref(content);

		if (isNonEmptyArray(stableContent)) {
			return stableContent.map(section => unref(section)).join("\n\n");
		}

		if (isNonEmptyString(stableContent)) {
			return stableContent;
		}

		return "";
	}

	/**
	 * If an indent is provided, indent the template output each time we
	 * encounter a new line.
	 *
	 * @param  {string}  template
	 *     The template to indent
	 * @param  {number}  indentLevel
	 *     The base indent level for this template
	 */
	function applyIndent(template, indentLevel) {
		if (!isNumber(indentLevel) || indentLevel <= 0) {
			return template;
		}

		const tabString = "\t".repeat(indentLevel);

		return `\t${template.replace(/\n(?!\n)/g, `\n${tabString}`)}`;
	}

	return template;
}
