<template>
	<component-page>
		<template #title>Form screen</template>

		<template #introduction>
			<p>
				<code>form-screen</code>
				groups the fields and other content for one screen in a
				<code>form-flow</code>
				. The flow renders only the active screen.
			</p>

			<p>
				A screen can be nested at any depth in the flow's slot tree. Keep its
				<code>id</code>
				unchanged while it is part of the flow.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-id">
				<template #name>id</template>
				<template #type>String</template>
				<template #required>yes</template>
				<p>Stable unique identifier used to register the screen with its form-flow.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>default</template>
				<p>Fields and other content shown while the screen is active.</p>
			</component-slot>
		</component-slots>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="form-screen"</template>
				<p>Present on the active root element. Use it to scope styles to this component.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-screen-id">
				<template #attribute>data-screen-id</template>
				<p>Present on the active root element with the registered screen ID.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-form-screen />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormScreen from "./fragments/playground-form-screen.vue";
</script>
