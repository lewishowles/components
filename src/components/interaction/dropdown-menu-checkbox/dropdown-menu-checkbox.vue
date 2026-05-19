<template>
	<form-checkbox v-model="checked" class="px-4 py-1" data-test="dropdown-menu-checkbox">
		<slot />
	</form-checkbox>
</template>

<script setup>
const checked = defineModel({
	type: Boolean,
});
</script>
