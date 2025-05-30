<template>
	<component-page>
		<template #title>
			Form actions
		</template>

		<template #introduction>
			<p><code>form-actions</code> is a functional component that adds consistent layout of the actions of a form.</p>
		</template>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The default slot contains the content to wrap.</p>
			</component-slot>

			<component-slot id="slot-tertiary-actions">
				<template #name>
					tertiary-actions
				</template>

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
