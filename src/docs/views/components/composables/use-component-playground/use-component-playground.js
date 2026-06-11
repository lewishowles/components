import { computed, ref } from "vue";
import { deepCopy } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";

import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

/**
 * Create metadata-backed state for a component playground variant.
 *
 * @param  {object}  componentMetadata
 *     Metadata for the component being rendered.
 * @param  {string}  variantName
 *     The snippet variant to display.
 * @returns {object}
 */
export function useComponentPlayground(componentMetadata, variantName) {
	if (!componentMetadata) {
		throw new Error("Component playground metadata is required.");
	}

	if (!isNonEmptyString(variantName)) {
		throw new Error("A component playground variant name is required.");
	}

	const example = componentMetadata.examples.find((example) => example.name === variantName);

	if (!example) {
		throw new Error(`Unknown ${componentMetadata.name} playground variant: ${variantName}`);
	}

	const textSlots = ref(deepCopy(example.snippet.slots));
	const props = ref(deepCopy(example.snippet.props ?? {}));
	const events = ref(deepCopy(example.snippet.events ?? {}));

	// Props ready to pass to the live component preview.
	const componentProps = computed(() => {
		return Object.fromEntries(
			Object.entries(props.value).map(([key, prop]) => [toCamelCase(key), prop.value]),
		);
	});

	const template = useTemplateGenerator(componentMetadata.name, {
		slots: textSlots,
		props,
		events,
	});

	return {
		componentProps,
		events,
		example,
		props,
		template,
		textSlots,
	};
}

/**
 * Convert kebab-case template prop names to camelCase component prop names.
 *
 * @param  {string}  value
 *     Prop name from snippet metadata.
 * @returns {string}
 */
function toCamelCase(value) {
	return value.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
}
