<!-- This fixture uses floating-details inside a horizontally-scrolling data-table cell,
where the component root spans the full cell width but the summary trigger sits at its end. -->
<template>
	<data-table class="w-96" v-bind="{ columns, data }">
		<template #actions>
			<floating-details class="flex w-full justify-end" v-bind="{ align: props.align }">
				<template #summary>Summary label</template>

				<template #default="{ close }">
					<div class="w-96" data-test="table-details-content">
						<button data-test="close-button" @click="close">Close</button>
					</div>
				</template>
			</floating-details>
		</template>
	</data-table>
</template>

<script setup>
import DataTable from "../data-table/data-table.vue";
import FloatingDetails from "./floating-details.vue";

const props = defineProps({
	align: {
		type: String,
		default: "end",
	},
});

const columns = {
	actions: { align: "right", label: "Actions" },
	description: { cellClasses: "min-w-[800px]", label: "Description" },
	title: { label: "Title", primary: true },
};

const data = [
	{
		actions: "",
		description: "This column makes the table scroll horizontally.",
		id: "floating-details-table-row",
		title: "Table row",
	},
];
</script>
