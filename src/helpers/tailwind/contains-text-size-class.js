/**
 * Determine if the provided class string (which may contain one or more
 * classes) contains a Tailwind text size class.
 *
 * @param  {string}  classString
 *     The class string to test.
 */
export function containsTextSizeClass(classString) {
	const testRegex = /\btext-(xs|sm|base|lg|xl|\dxl)\b/;

	return testRegex.test(classString);
}
