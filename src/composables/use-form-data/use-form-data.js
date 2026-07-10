import { pick, pickAs } from "@lewishowles/helpers/object";
import { ref, toRaw, watch } from "vue";
import { cloneFormData } from "@/utilities/clone-form-data.js";

/**
 * Normalise field values for form initialisation based on declared field types.
 *
 * @param  {object}  data
 *     The picked/renamed form data object.
 * @param  {object}  fieldTypes
 *     Field type transformations keyed by form field name, each value one of
 *     "nullable-number" or "nullable-string".
 * @returns {object}
 *     A new object with normalised values.
 */
export function normaliseForInitialisation(data, fieldTypes) {
	const result = {};

	for (const [key, value] of Object.entries(data)) {
		const fieldType = fieldTypes[key];

		if (fieldType === "nullable-number") {
			result[key] = value == null ? "" : String(value);
		} else if (fieldType === "nullable-string") {
			result[key] = value == null ? "" : value;
		} else {
			result[key] = value;
		}
	}

	return result;
}

/**
 * Pick and optionally rename fields from the source value.
 *
 * @param  {object}  value
 *     The resolved source value.
 * @param  {string[]|object}  fields
 *     Either an array of keys to pick, or an object mapping form field names to
 *     source keys for renaming.
 * @returns {object}
 *     The picked (and optionally renamed) form data object.
 */
function resolveFields(value, fields) {
	// No fields specified; nothing to pick.
	if (!fields) {
		return {};
	}

	// Array form: pick listed keys directly from the source.
	if (Array.isArray(fields)) {
		return pick(value, fields);
	}

	// Object form: map each form field name to its source key.
	return pickAs(value, fields);
}

/**
 * Shape a resolved source value into a form data object, following the same
 * function-or-options-object convention as `useFormData`'s `mapper` param.
 *
 * @param  {unknown}  value
 *     The resolved source value to map.
 * @param  {function|object}  mapper
 *     Either a function that maps the resolved source value to the initial
 *     form data object, or an options object `{ fields, fieldTypes }` for
 *     declarative field selection and type normalisation. Defaults to a deep
 *     clone of the source value.
 * @returns {object}
 *     The mapped form data object.
 */
export function mapFormData(value, mapper = (data) => cloneFormData(toRaw(data))) {
	if (typeof mapper === "function") {
		return mapper(value);
	}

	const { fields, fieldTypes = {} } = mapper;

	return normaliseForInitialisation(resolveFields(value, fields), fieldTypes);
}

/**
 * Initialise form data from an async data source. Fires once when the source
 * first becomes available.
 *
 * When using this composable, gate the form on the query's `isReady` to ensure
 * fields mount after the data is available.
 *
 * @param  {ref}  source
 *     The async data source to watch, typically the `data` ref from a Pinia
 *     Colada query.
 * @param  {function|object}  mapper
 *     Either a function that maps the resolved source value to the initial
 *     form data object, or an options object `{ fields, fieldTypes }` for
 *     declarative field selection and type normalisation. Defaults to a deep
 *     clone of the source value.
 */
export function useFormData(source, mapper = (data) => cloneFormData(toRaw(data))) {
	// The form data, populated once the source first resolves.
	const formData = ref({});
	// Guards against populating more than once, even if the source changes after the first resolve.
	const populated = ref(false);

	watch(
		source,
		(value) => {
			if (!value || populated.value) {
				return;
			}

			populated.value = true;
			formData.value = mapFormData(value, mapper);
		},
		{ immediate: true },
	);

	return formData;
}
