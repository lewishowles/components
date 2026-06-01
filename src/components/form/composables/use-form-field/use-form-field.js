import { computed, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";
import useInputId from "@/components/form/composables/use-input-id/use-input-id";

/**
 * Consolidate form field boilerplate, such as ID generation.
 *
 * @param  {string}  id
 *     An optional ID for the field. Generates a random ID if not provided.
 */
export default function useFormField({ id } = {}) {
	const slots = useSlots();

	// Generated IDs for our form fragments.
	const { inputId } = useInputId(id);
	const introductionId = computed(() => `${inputId.value}-introduction`);
	const errorId = computed(() => `${inputId.value}-error`);
	const helpId = computed(() => `${inputId.value}-help`);

	// Whether each type of supplementary content has been provided via slots.
	const haveIntroduction = computed(() => isNonEmptySlot(slots.introduction));
	const haveHelp = computed(() => isNonEmptySlot(slots.help));
	const haveError = computed(() => isNonEmptySlot(slots.error));

	// Combined aria-describedby value from all present supplementary IDs.
	const describedBy = computed(() => {
		const ids = [];

		if (haveIntroduction.value) {
			ids.push(introductionId.value);
		}

		if (haveHelp.value) {
			ids.push(helpId.value);
		}

		if (haveError.value) {
			ids.push(errorId.value);
		}

		return ids.length ? ids.join(" ") : undefined;
	});

	return {
		describedBy,
		errorId,
		haveError,
		haveHelp,
		haveIntroduction,
		helpId,
		inputId,
		introductionId,
		invalid: haveError,
	};
}
