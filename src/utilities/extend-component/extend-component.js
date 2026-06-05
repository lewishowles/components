import { h, mergeProps, ref } from "vue";

/**
 * Create a wrapper around an existing component that forwards all props,
 * attributes, slots, v-model bindings, and exposed methods automatically, while
 * allowing default props and slots to be provided.
 *
 * @param  {object}  baseComponent
 *     The component to extend.
 * @param  {string}  options.name
 *     An optional name for the resulting component.
 * @param  {object}  options.props
 *     Default props to apply, overridable by the caller.
 * @param  {object}  options.slots
 *     Default slots, as render functions, overridable by the caller.
 */
export function extendComponent(baseComponent, { name, props = {}, slots = {} } = {}) {
	return {
		name: name ?? `extended-${baseComponent.name ?? "component"}`,
		inheritAttrs: false,

		setup(_props, { attrs, slots: callerSlots, expose }) {
			// A reference to the extended component instance, allowing us to
			// re-expose its public API.
			const inner = ref(null);

			// Forward whatever the base component exposes. We use a Proxy
			// because `expose` needs to be called during `setup`, but the inner
			// component doesn't exist yet. The Proxy allows us to fetch from
			// the inner component when requested, not right now.
			expose(
				new Proxy(
					{},
					{
						get: (_target, key) => inner.value?.[key],
						has: (_target, key) => inner.value !== null && key in inner.value,
					},
				),
			);

			// Caller attributes override default props (mergeProps also merges
			// class and style, and concatenates event handlers), and caller
			// slots override default slots.
			return () =>
				h(baseComponent, mergeProps(props, attrs, { ref: inner }), { ...slots, ...callerSlots });
		},
	};
}
