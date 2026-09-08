<template>
	<form-wrapper v-bind="{ rules }">
		<form-field
			v-bind="{
				id: 'person',
				labelKey: 'name',
				name: 'person',
				options,
				type: 'combo-box',
				valueKey: 'id',
			}"
		>
			Person
		</form-field>

		<template #submit-button-label>Submit</template>
	</form-wrapper>
</template>

<script setup>
// The wrapper validates the selected option value, not the visible query text.
const options = [
	{ id: "person-42", name: "Avery Lane" },
	{ id: "person-7", name: "Basil Morgan" },
];

const rules = {
	person: [{ rule: "required", message: "Choose a person" }],
};
</script>
