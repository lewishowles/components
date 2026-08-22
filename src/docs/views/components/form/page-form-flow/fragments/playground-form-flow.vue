<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-flow">
		<template #title>Form flow</template>

		<form-flow v-model="componentModel">
			<form-screen id="account">
				<form-field name="email">Email address</form-field>
			</form-screen>

			<form-screen id="profile">
				<form-field name="displayName">Display name</form-field>
			</form-screen>
		</form-flow>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Observed via v-model on form-flow; passed to component-playground to display.
const componentModel = ref({});

const template = useTemplateGenerator("form-flow", {
	additionalContent: [
		'\n\t<form-screen id="account">\n\t\t<form-field name="email">\n\t\t\tEmail address\n\t\t</form-field>\n\t</form-screen>',
		'\n\n\t<form-screen id="profile">\n\t\t<form-field name="displayName">\n\t\t\tDisplay name\n\t\t</form-field>\n\t</form-screen>',
	],
});
</script>
