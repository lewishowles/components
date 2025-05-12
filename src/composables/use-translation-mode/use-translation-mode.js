import { useStorage } from "@vueuse/core";

/**
 * Keep track of the user's "translation mode" preference.
 */
export default function useTranslationMode() {
	// Whether to use translation mode.
	const useTranslation = useStorage("lh:use-translation-mode", false);
	// Any prefix to add to the translation path prefix when using translation mode.
	const translationPathPrefix = useStorage("lh:translation-path-prefix", "path.to.your.translation");

	return {
		useTranslation,
		translationPathPrefix,
	};
}
