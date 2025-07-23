import { isNonEmptyString } from "@lewishowles/helpers/string";
import { ref, unref, watchEffect } from "vue";

const baseTitle = document.title || "Components | A library of beautiful components";

/**
 * Interact with the current page title.
 */
export default function useTitle() {
	const title = ref(baseTitle);

	/**
	 * Set a new title, if the provided title is valid. The new title combines
	 * the provided title with the base title.
	 *
	 * @param  {string}  newTitle
	 *     The new title to set.
	 */
	function setTitle(newTitle) {
		const internalTitle = unref(newTitle);

		if (!isNonEmptyString(internalTitle)) {
			title.value = baseTitle;

			return;
		}

		title.value = [internalTitle, baseTitle].join(" | ");
	}

	// When our internal title changes, update the document title.
	watchEffect(() => {
		document.title = title.value;
	});

	return {
		title,
		setTitle,
	};
}
