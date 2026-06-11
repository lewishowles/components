import { computed, ref } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { uiButtonMetadata } from "@/components/interaction/ui-button/ui-button.metadata.js";

import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

/**
 * Create metadata-backed state for a ui-button playground.
 *
 * @param   {string}  variantName  The snippet variant to display.
 * @returns {object}
 */
export function useUiButtonPlayground(variantName) {
	if (!isNonEmptyString(variantName)) {
		throw new Error("A ui-button playground variant name is required.");
	}

	const snippetVariant = uiButtonMetadata.snippetVariants.find(
		(variant) => variant.name === variantName,
	);

	if (!snippetVariant) {
		throw new Error(`Unknown ui-button playground variant: ${variantName}`);
	}

	const textSlots = ref(structuredClone(snippetVariant.template.slots));
	const props = ref(structuredClone(snippetVariant.template.props ?? {}));
	const events = ref(structuredClone(snippetVariant.template.events ?? {}));

	// Props ready to pass to the live component preview.
	const componentProps = computed(() => {
		return Object.fromEntries(
			Object.entries(props.value).map(([key, prop]) => [toCamelCase(key), prop.value]),
		);
	});

	const template = useTemplateGenerator("ui-button", { slots: textSlots, props, events });

	return {
		componentProps,
		events,
		props,
		template,
		textSlots,
	};
}

/**
 * Convert kebab-case template prop names to camelCase component prop names.
 *
 * @param   {string}  value  Prop name from snippet metadata.
 * @returns {string}
 */
function toCamelCase(value) {
	return value.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
}
