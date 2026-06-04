<template>
	<component-page>
		<template #title> {{ NAME | kebab }} </template>

		<template #introduction>
			<p><code>{{ NAME | kebab }}</code> [describe what this component is for].</p>
		</template>

		<component-props>
			<component-prop id="prop-example">
				<template #name> example </template>

				<template #type> String </template>

				<template #default-value> null </template>

				<p>[Describe what this prop controls.]</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name> default </template>

				<p>The default slot contains [describe the default content].</p>
			</component-slot>
		</component-slots>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="{{ NAME | kebab }}"</template>

				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-{{ NAME | kebab }} />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import Playground{{ NAME | pascal }} from "./fragments/playground-{{ NAME | kebab }}.vue";
</script>
