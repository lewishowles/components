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

	// The source used to seed the form.
	const formInitialData = computed(() => {
		return haveInitialData ? toValue(props.initialData) : props.modelValue;
	});

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

	// Synchronous initial data seeds before this watcher exists, so emit its current value immediately.
	watch(form.formData, (value) => emit("update:modelValue", value), {
		deep: true,
		immediate: haveInitialData && Boolean(formInitialData.value),
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
