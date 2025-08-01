import { deepMerge } from "@lewishowles/helpers/object";
import { mount, shallowMount, RouterLinkStub } from "@vue/test-utils";

const globalOptions = {
	global: {
		components: {
			RouterLink: RouterLinkStub,
		},
	},
};

/**
 * Returns a function to simplify mounting components in Vitest by providing
 * the ability to mount a component with props without having to specify the
 * "props" key, unless "slots" are also required.
 *
 * Any default options passed to this function are merged with any provided
 * options when mounting a component.
 *
 * @param  {object}  component
 *     The component to mount.
 * @param  {object}  defaultOptions
 *     Default options to pass to each subsequent mount call.
 * @param  {function}  mountFunction
 *     The function to use to mount the component.
 */
export function createMount(component, defaultOptions = {}, mountFunction = shallowMount) {
	/**
	 * Simplify mounting components in Vitest by providing a method to pass
	 * props without the need for a "props" key, unless we also need to specify
	 * "slots".
	 *
	 * @param  {object}  options
	 *     The options to pass to Vitest for this individual mount.
	 */
	return function (options = {}) {
		const isDirectProps = !Object.hasOwn(options, "props") && !Object.hasOwn(options, "slots") && !Object.hasOwn(options, "global");
		const providedOptions = isDirectProps ? { props: options } : options;

		return mountFunction(
			component,
			deepMerge(defaultOptions, globalOptions, providedOptions),
		);
	};
};

/**
 * Use mount instead of shallowMount to create a mount.
 */
export function createDeepMount(component, defaultOptions = {}) {
	return createMount(component, defaultOptions, mount);
}
