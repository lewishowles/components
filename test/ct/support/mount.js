import { deepMerge } from "@lewishowles/helpers/object";

// Minimal SVG for slot tests; Playwright CT's string-only slot API doesn't accept component references.
export const slotSvg = "<svg width='24' height='24' viewBox='0 0 24 24'></svg>";

/**
 * Returns a function to simplify mounting components in Playwright component
 * tests with shared default props, slots, or global options.
 *
 * @param  {object}  component
 *     The component to mount.
 * @param  {object}  defaultOptions
 *     Default options to pass to each subsequent mount call.
 */
export function createMount(component, defaultOptions = {}) {
	/**
	 * Mount a component using Playwright's mount fixture.
	 *
	 * @param  {function}  mount
	 *     Playwright's mount fixture.
	 * @param  {object}  options
	 *     Options for this individual mount.
	 */
	return function mountComponent(mount, options = {}) {
		const isDirectProps =
			!Object.hasOwn(options, "props") &&
			!Object.hasOwn(options, "slots") &&
			!Object.hasOwn(options, "global");

		const providedOptions = isDirectProps ? { props: options } : options;

		return mount(component, deepMerge(defaultOptions, providedOptions));
	};
}
