import { computed } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { nanoid } from "nanoid";

/**
 * Generate an ID for an input, depending on whether an ID is provided by the
 * component.
 */
export default function useInputId(id) {
	// The ID used by the input and label. If an ID is provided in props, that is
	// used as-is.
	const inputId = computed(() => {
		if (isNonEmptyString(id)) {
			return id;
		}

		return nanoid();
	});

	return {
		inputId,
	};
}
