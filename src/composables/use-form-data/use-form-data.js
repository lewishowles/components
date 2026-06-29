import { ref, toRaw, watch } from "vue";

/**
 * Initialise form data from an async data source. Fires once when the source
 * first becomes available.
 *
 * When using this composable, gate the form on the query's `isReady` to ensure
 * fields mount after the data is available.
 *
 * @param  {ref}  source
 *     The async data source to watch, typically the `data` ref from a Pinia
 *     Colada query.
 * @param  {function}  mapper
 *     Maps the resolved source value to the initial form data object.
 *     Defaults to a deep clone of the source value.
 */
export function useFormData(source, mapper = (data) => structuredClone(toRaw(data))) {
	// The form data, populated once the source first resolves.
	const formData = ref({});
	// Guards against populating more than once, even if the source changes after the first resolve.
	const populated = ref(false);

	watch(
		source,
		(value) => {
			if (!value || populated.value) {
				return;
			}

			populated.value = true;
			formData.value = mapper(value);
		},
		{ immediate: true },
	);

	return formData;
}
