<template>
	<component-page>
		<template #title>Form actions</template>

		<template #introduction>
			<p>
				<code>form-actions</code>
				is a functional component that adds consistent layout of the actions of a form.
			</p>
		</template>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>default</template>

				<p>The default slot contains the content to wrap.</p>
			</component-slot>

			<component-slot id="slot-label">
				<template #name>label</template>

				<p>
					An optional visually hidden label for the action group, used by screen readers to identify
					the group's purpose.
				</p>

				<p>
					Provide a label when the form has multiple action groups that need to be distinguished
					(e.g. primary actions and a "danger zone"), or when actions appear far from the form
					fields.
				</p>
			</component-slot>

			<component-slot id="slot-tertiary-actions">
				<template #name>tertiary-actions</template>

				<p>Any additional actions that should appear below the main row.</p>
			</component-slot>
		</component-slots>

		<component-playgrounds>
			<playground-form-actions />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormActions from "./fragments/playground-form-actions.vue";
</script>
