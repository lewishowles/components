import { computed, ref } from "vue";

/**
 * Generate appropriate IDs for error and help text for use by form fields and
 * `form-supplementary`.
 *
 * @param  {string}  baseId
 *     The base ID of the input, from which we generate additional IDs.
 */
export default function(baseId) {
	// The ID for the error text.
	const errorId = computed(() => `${baseId}-error`);
	// The ID for the help text.
	const helpId = computed(() => `${baseId}-help`);
	// The combined ID for use in aria-describedby.
	const describedBy = ref("");

	/**
	 * Update the describedBy value based on whether we have error text or help
	 * text. This is not done by computed property because those values are
	 * provided by slots, not props.
	 *
	 * @param  {boolean}  options.haveError
	 *     Whether we have an error to display.
	 * @param  {boolean}  options.haveHelp
	 *     Whether we have help to display.
	 */
	function updateDescribedBy({ haveHelp, haveError } = {}) {
		if (!haveHelp && !haveError) {
			describedBy.value = null;

			return;
		}

		const ids = [];

		if (haveHelp) {
			ids.push(helpId.value);
		}

		if (haveError) {
			ids.push(errorId.value);
		}

		describedBy.value = ids.join(" ");
	}

	return {
		errorId,
		helpId,
		describedBy,
		updateDescribedBy,
	};
}
