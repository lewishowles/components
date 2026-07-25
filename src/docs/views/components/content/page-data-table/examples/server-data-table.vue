<template>
	<data-table
		mode="server"
		v-model:state="state"
		v-bind="{ columns, data, error, loading, totalRows }"
	/>
</template>

<script setup>
import { isNumber } from "@lewishowles/helpers/number";
import { isObject } from "@lewishowles/helpers/object";
import { ref, watch } from "vue";

const columns = {
	name: { label: "Name", primary: true },
	email: { label: "Email" },
};

const data = ref([]);
const totalRows = ref(0);
const loading = ref(false);
const error = ref(null);

const state = ref({
	page: 1,
	itemsPerPage: 10,
	sort: null,
	filters: { search: "" },
});

/**
 * Load and adapt the current page of users.
 *
 * @param  {object}  currentState
 *     The search, sort, and pagination state reported by the table.
 * @param  {AbortSignal}  signal
 *     The signal used to cancel an outdated request.
 */
async function fetchUsers(currentState, signal) {
	loading.value = true;
	error.value = null;

	try {
		const params = new URLSearchParams({
			page: String(currentState.page),
			itemsPerPage: String(currentState.itemsPerPage),
			search: String(currentState.filters.search ?? ""),
			sortColumn: currentState.sort?.column ?? "",
			sortDirection: currentState.sort?.direction ?? "",
		});

		const response = await fetch(`/api/users?${params}`, { signal });

		if (!response.ok) {
			throw new Error("Unable to load users.");
		}

		const result = await response.json();

		if (!isObject(result) || !Array.isArray(result.items) || !isNumber(result.total)) {
			throw new Error("The server returned invalid user data.");
		}

		data.value = result.items.map(({ id, name, email }) => ({
			id,
			name,
			email,
		}));

		totalRows.value = result.total;
	} catch (requestError) {
		if (!signal.aborted) {
			error.value = requestError;
		}
	} finally {
		if (!signal.aborted) {
			loading.value = false;
		}
	}
}

watch(
	state,
	async (currentState, _previousState, onCleanup) => {
		const controller = new AbortController();

		onCleanup(() => controller.abort());
		await fetchUsers(currentState, controller.signal);
	},
	{ immediate: true, deep: true },
);
</script>
