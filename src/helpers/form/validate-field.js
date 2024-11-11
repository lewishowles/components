
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { isNumber } from "@lewishowles/helpers/number";

/**
 * Validate this field for all provided validation rules.
 *
 * @param  {string}  fieldName
 *     The name of the field to validate, allowing us to retrieve its value from
 *     the form data.
 * @param  {array}  validationRules
 *     The rules to validate the field against.
 * @param  {object}  formData
 *     The current values of each form field.
 */
export function validateField(fieldName, validationRules, formData) {
	// If we can't determine all of the information we need, we can't validate,
	// but we also can't return a meaningful message. We could return a general
	// error, but we don't want that to be shown to the user unexpectedly.
	if (!isNonEmptyString(fieldName) || !isNonEmptyArray(validationRules) || !isNonEmptyObject(formData)) {
		return true;
	}

	const validationErrors = [];

	for (const rule of validationRules) {
		if (!validateRule(rule)) {
			if (rule.rule === "required") {
				// If showing a required message, we only show one error, as
				// the field probably won't match any other validation
				// either.
				return [rule.message];
			} else {
				validationErrors.push(rule.message);
			}
		}
	}

	return validationErrors;
}

/**
 * Validate this field for a single rule.
 *
 * @param  {object}  rule
 *     The rule to validate against, including any additional properties.
 */
function validateRule(rule) {
	switch(rule.rule) {
		case "required":
			return !isNonEmptyString(model.value);
		case "email":
			return model.value.contains("@");
		case "minimum_length":
			if (!isNonEmptyString(model.value) || !isNumber(rule.length)) {
				return false;
			}

			return model.value.length >= rule.length;
	}

	return true;
}
