import { toCamelCase } from "@lewishowles/helpers/string";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";
import { computed, getCurrentInstance, toRefs, toValue, useSlots, watch } from "vue";

import { useForm } from "@/composables/use-form/use-form.js";

/**
 * Share form setup between hosts and dispatch direct submit listeners.
 * Hosts provide the form context and optional empty-submit fallback.
 *
 * @param  {object}  props
 *     The host component's form props.
 * @param  {function}  emit
 *     The host component's emit function.
 * @param  {object}  [options]
 *     Extra useForm options and an optional fallback for an unhandled submit.
 * @returns  {object}
 *     Form state, presentation flags, and generic form context for the host.
 */
export function useFormHost(props, emit, options = {}) {
	// The host instance exposes direct submit listeners without changing its public API.
	const instance = getCurrentInstance();
	// Host slots determine which optional submit feedback and labels should render.
	const slots = useSlots();

	// Whether the caller explicitly supplied an initial data source.
	const haveInitialData = Object.keys(instance?.vnode.props ?? {}).some(
		(key) => toCamelCase(key) === "initialData",
	);

	// The source the starting data was last built from, and the starting data built from it. A
	// parent re-render or a changed default reuses this result, so it can't replace a pending
	// reload of a new record with the old record's data.
	let lastSeedSource;
	let lastSeed;

	// The starting data for the form: the chosen source with any empty field filled from its
	// `fields` default once per source, plus whether a default was added, so the host sends
	// the completed value to the parent.
	const formSeed = computed(() => {
		// The initial data when the caller supplied it, otherwise the bound model.
		const source = haveInitialData ? toValue(props.initialData) : props.modelValue;

		if (lastSeed && source === lastSeedSource) {
			return lastSeed;
		}

		lastSeedSource = source;

		if (!source) {
			lastSeed = { data: source, addedDefaults: false };

			return lastSeed;
		}

		// A copy of the source, so filling defaults never changes the caller's object.
		const data = { ...source };

		// Whether any field was filled from its default.
		let addedDefaults = false;

		for (const [name, settings] of Object.entries(props.fields ?? {})) {
			if (Object.hasOwn(data, name) && data[name] !== undefined) {
				continue;
			}

			// The field's default, read from a ref or computed value when one was given.
			const value = toValue(settings?.default);

			if (value !== undefined) {
				data[name] = value;
				addedDefaults = true;
			}
		}

		lastSeed = { data: addedDefaults ? data : source, addedDefaults };

		return lastSeed;
	});

	// The starting data passed to useForm, with defaults filled in, or the empty source while
	// initial data is still loading.
	const formInitialData = computed(() => formSeed.value.data);

	// The host may handle a submit without a direct listener.
	const { handleEmptySubmit, ...formOptions } = options;

	// The value type for each field, taken from the fields settings first and
	// the deprecated fieldTypes prop second.
	const fieldTypes = computed(() => {
		const types = { ...props.fieldTypes };

		for (const [name, settings] of Object.entries(props.fields ?? {})) {
			const valueType = toValue(settings?.valueType);

			if (valueType !== undefined) {
				types[name] = valueType;
			}
		}

		return types;
	});

	// The shared form state and validation methods.
	const form = useForm({
		...toRefs(props),
		...formOptions,
		fieldTypes,
		initialData: formInitialData,
		onSubmit: callSubmitListeners,
	});

	// The form-wide status prop overrides submit lifecycle status when provided.
	const formStatus = computed(() => props.status ?? form.status.value);
	// Whether a final submit label is available.
	const haveSubmitButtonLabel = computed(() => isNonEmptySlot(slots["submit-button-label"]));
	// Whether a submit errors slot is available.
	const haveSubmitErrorsSlot = computed(() => isNonEmptySlot(slots["submit-errors"]));
	// Whether the actions group has an accessible label.
	const haveActionsLabel = computed(() => isNonEmptySlot(slots["actions-label"]));

	// Context shared by form-field and form-layout consumers.
	const formContext = {
		fieldErrorsFor: form.fieldErrorsFor,
		fieldSettingsFor,
		formData: form.formData,
		registerField: form.registerField,
		unregisterField: form.unregisterField,
		updateFieldValue: form.updateFieldValue,
		isReadonly: form.isReadonly,
		isFieldRequired: form.isFieldRequired,
		isCompact: computed(() => props.compact),
	};

	/**
	 * Look up the settings that the form's fields prop holds for one field.
	 *
	 * @param  {string}  name
	 *     The field name used as the settings key.
	 * @returns  {object}
	 *     The field settings, or an empty object when none were supplied.
	 */
	function fieldSettingsFor(name) {
		return props.fields?.[name] ?? {};
	}

	// Starting data that is ready before this watcher exists never triggers it, so send the current
	// value straight away when it came from initial data or gained a default.
	watch(form.formData, (value) => emit("update:modelValue", value), {
		deep: true,
		immediate: Boolean(formInitialData.value) && (haveInitialData || formSeed.value.addedDefaults),
	});

	return {
		...form,
		formContext,
		formInitialData,
		formStatus,
		haveSubmitButtonLabel,
		haveSubmitErrorsSlot,
		haveActionsLabel,
	};

	/**
	 * Await direct submit listeners or use the host's fallback when none exist.
	 *
	 * @param  {object}  data
	 *     The form data ready to be submitted.
	 * @returns  {unknown}
	 *     The first listener's resolved value, or the empty-submit fallback's
	 *     result when no listener is registered.
	 */
	async function callSubmitListeners(data) {
		const onSubmit = instance?.vnode.props?.onSubmit;
		const handlers = Array.isArray(onSubmit) ? onSubmit : [onSubmit].filter(Boolean);

		if (handlers.length === 0) {
			return handleEmptySubmit?.(data);
		}

		const results = await Promise.all(handlers.map((handler) => handler(data)));

		return results[0];
	}
}
