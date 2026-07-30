/**
 * Clone a form data value so later edits to the clone don't affect the
 * original.
 *
 * Arrays, plain objects, and dates can be copied safely, so those are the
 * only values actually cloned. Everything else, including files, Map, Set,
 * RegExp, and class instances, is returned unchanged: cloning them would
 * either lose information (a File can't be rebuilt from its properties) or
 * break identity checks elsewhere in the form.
 *
 * @param  {unknown}  value
 *     The value to clone.
 * @returns {unknown}
 *     A new array, object, or date built from `value`, or `value` itself
 *     when it isn't one of those three.
 */
export function cloneFormData(value) {
	// File, Blob, and FileList aren't always available (Node/SSR, or a
	// browser missing one of the three), so each is checked individually
	// rather than assumed to exist. None of them can be rebuilt from their
	// public properties, and a caller may rely on the same instance staying
	// selected, so they're returned as-is.
	if (
		(typeof File !== "undefined" && value instanceof File) ||
		(typeof Blob !== "undefined" && value instanceof Blob) ||
		(typeof FileList !== "undefined" && value instanceof FileList)
	) {
		return value;
	}

	// Arrays are cloned item by item so nested arrays or objects don't
	// share references with the original.
	if (Array.isArray(value)) {
		return value.map(cloneFormData);
	}

	// Dates are copied by value (a new instance with the same time) so
	// mutating one date can't affect the other.
	if (value instanceof Date) {
		return new Date(value.getTime());
	}

	// Only plain objects (a literal `{}` or `Object.create(null)`) are
	// cloned this way. Anything else with its own prototype, such as Map,
	// Set, RegExp, Error, or a class instance, has behaviour that a
	// generic key-by-key copy would lose, so it falls through to the
	// reference return below.
	if (
		value !== null &&
		typeof value === "object" &&
		(Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)
	) {
		const result = {};

		for (const [key, child] of Object.entries(value)) {
			result[key] = cloneFormData(child);
		}

		return result;
	}

	// Primitives and any structured or class value not handled above are
	// returned as-is: there's nothing left to clone.
	return value;
}
