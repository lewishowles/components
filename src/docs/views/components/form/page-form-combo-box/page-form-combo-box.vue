<template>
	<component-page>
		<template #title>form-combo-box</template>

		<template #introduction>
			<p>
				<code>form-combo-box</code>
				pairs a search input with a list of results, handling the keyboard, ARIA, and open/close
				behaviour of the combobox interaction pattern on top of the
				<router-link :to="{ name: 'use-combobox' }">
					<code>useCombobox</code>
				</router-link>
				composable.
			</p>
			<p>
				Only when a result is selected does
				<code>form-combo-box</code>
				take its value, meaning an arbitrary value does not count as a value for the field.
			</p>
		</template>

		<component-playgrounds>
			<playground-form-combo-box />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormComboBox from "./fragments/playground-form-combo-box.vue";
</script>
