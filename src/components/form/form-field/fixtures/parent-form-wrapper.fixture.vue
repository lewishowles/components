<script setup>
import { provide } from "vue";

provide("form-wrapper", { registerField: () => {} });
</script>

<template>
	<form-field type="text" />
</template>
