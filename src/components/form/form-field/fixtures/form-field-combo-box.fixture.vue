<template>
	<form-wrapper v-bind="{ rules }">
		<form-field
			v-bind="{
				id: 'pilot',
				labelKey: 'name',
				name: 'pilot',
				options,
				type: 'combo-box',
				valueKey: 'id',
			}"
		>
			Pilot
		</form-field>

		<template #submit-button-label>Submit</template>
	</form-wrapper>
</template>

<script setup>
// The wrapper validates the selected option value, not the visible query text.
const options = [
	{ id: "pilot-42", name: "Amelia Earhart" },
	{ id: "pilot-7", name: "Bessie Coleman" },
];

const rules = {
	pilot: [{ rule: "required", message: "Choose a pilot" }],
};
</script>
