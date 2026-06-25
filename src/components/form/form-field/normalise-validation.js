import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";

/**
 * Split an array of validation entries into object rules (for the existing
 * `validateField` pipeline) and function rules (custom logic).
 *
 * @param  {Array}  rules
 *     The raw validation array, which may contain plain objects and/or
 *     functions.
 * @returns {{ objectRules: object[], functionRules: Function[] }}
 */
export function normaliseValidation(rules) {
	if (!isNonEmptyArray(rules)) {
		return { objectRules: [], functionRules: [] };
	}

	const objectRules = [];
	const functionRules = [];

	for (const rule of rules) {
		if (isFunction(rule)) {
			functionRules.push(rule);
		} else {
			objectRules.push(rule);
		}
	}

	return { objectRules, functionRules };
}

/**
 * Run function-rule shorthand entries against a field value.
 *
 * Each function receives `(value, formData)` and its return value determines
 * the outcome:
 *
 * - `true` or any other truthy non-string value — valid (no error).
 * - A non-empty string — invalid; the string becomes the error message.
 * - A non-empty array of strings — invalid; each string becomes an error message.
 *
 * @param  {Function[]}  rules
 *     The function shorthand rules to evaluate.
 * @param  {any}         value
 *     The current field value.
 * @param  {object}      formData
 *     The current form data, keyed by field name.
 * @returns {string[]}
 */
export function validateFunctionRules(rules, value, formData) {
	const errors = [];

	for (const rule of rules) {
		const result = rule(value, formData);

		if (isNonEmptyString(result)) {
			errors.push(result);
		} else if (isNonEmptyArray(result)) {
			errors.push(...result.filter(isNonEmptyString));
		}
	}

	return errors;
}
