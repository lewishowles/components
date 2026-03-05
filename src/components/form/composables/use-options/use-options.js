import { computed, unref } from "vue";
import { isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { isNumber } from "@lewishowles/helpers/number";
import { nanoid } from "nanoid";

/**
 * Standardise a set of options into a format that can be used by other
 * components. Options can be provided in a range of formats:
 *
 * - An array of strings or numbers, used as the key and value
 * - An array of objects, containing a key and value pair
 * - An array of any objects when combined with the labelKey and valueKey
 *   properties.
 * - An array containing any combination of the above, or
 * - An object where each key-value pair will be turned into a single option.
 */
export default function useOptions(providedOptions, { labelKey = "label", valueKey = "value" } = {}) {
	// Our standardised options, converting the range of allowed options formats
	// into an array of objects containing a label and a value.
	const options = computed(() => {
		const originalOptions = unref(providedOptions);

		if (!isNonEmptyObject(providedOptions) && !isNonEmptyArray(providedOptions)) {
			return [];
		}

		const internalOptions = [];

		// A single object, converting each key-value pair into an option.
		if (isNonEmptyObject(originalOptions)) {
			for (const value in originalOptions) {
				if (!Object.hasOwn(originalOptions, value)) {
					continue;
				}

				const label = originalOptions[value];

				internalOptions.push({ label, value });
			}
		}

		// An array of options
		if (isNonEmptyArray(originalOptions)) {
			originalOptions.forEach(option => {
				const isSimpleOption = isNumber(option) || isNonEmptyString(option);

				if (!isSimpleOption && !isNonEmptyObject(option)) {
					return;
				}

				// A string or a number, we use it for both the key and the
				// value.
				if (isSimpleOption) {
					internalOptions.push({ label: option, value: option });

					return;
				}

				// An object that contains both required keys, either those
				// provided by the user, or the default "label" and "value".
				if (Object.hasOwn(option, labelKey) && Object.hasOwn(option, valueKey)) {
					internalOptions.push({ label: option[labelKey], value: option[valueKey] });
				}
			});
		}

		if (!isNonEmptyArray(internalOptions)) {
			return [];
		}

		// Before returning, we generate a random ID for each option, to allow us to
		// properly link labels and inputs, as well as indicators as to the position
		// of each option in the list.
		const lastOptionIndex = internalOptions.length - 1;

		return internalOptions.map((option, optionIndex) => {
			option.first = optionIndex === 0;
			option.last = optionIndex === lastOptionIndex;
			option.id = nanoid();

			return option;
		});
	});

	return {
		options,
	};
}
