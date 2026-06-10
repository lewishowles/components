<template>
	<component-page>
		<template #title>Form layout</template>

		<template #introduction>
			<p>
				<code>form-layout</code>
				is a functional component that adds consistent spacing between elements in a form.
			</p>
		</template>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>default</template>

				<p>The default slot contains the content to wrap.</p>
			</component-slot>
		</component-slots>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="form-layout"</template>
				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-form-layout />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormLayout from "./fragments/playground-form-layout.vue";
</script>
