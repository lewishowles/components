/**
 * Recursively clone form data, preserving File, Blob, and FileList values by
 * reference instead of attempting a structural clone.
 *
 * Form data is expected to contain only plain objects, arrays, primitives,
 * and File/Blob/FileList values. Unlike structuredClone, this does not
 * special-case Date, Map, Set, or RegExp: those would be flattened to plain
 * objects. Add explicit handling here if a field type starts using them.
 *
 * @param  {unknown}  value
 *     The value to clone.
 * @returns {unknown}
 *     A deep clone of the value, with File/Blob/FileList preserved by reference.
 */
export function cloneFormData(value) {
	if (value instanceof File || value instanceof Blob || value instanceof FileList) {
		return value;
	}

	if (Array.isArray(value)) {
		return value.map(cloneFormData);
	}

	if (value !== null && typeof value === "object") {
		const result = {};

		for (const [key, child] of Object.entries(value)) {
			result[key] = cloneFormData(child);
		}

		return result;
	}

	return value;
}
