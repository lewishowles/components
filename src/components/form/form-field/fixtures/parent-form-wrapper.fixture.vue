<script setup>
import { provide } from "vue";

provide("form", { registerField: () => {} });
</script>

<template>
	<form-field type="text" />
</template>
