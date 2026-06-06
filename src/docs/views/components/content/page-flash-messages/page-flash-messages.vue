<template>
	<component-page>
		<template #title>flash-messages</template>

		<template #introduction>
			<p>
				Display one or more flash messages to the user, optionally filtered to the provided
				<code>namespace</code>
				. If no
				<code>namespace</code>
				is provided, messages that are generated without a
				<code>namespace</code>
				will be shown.
			</p>

			<p>
				It may often be useful to include one instance without a namespace at the top of a page for
				general messages, and other namespaced instances nearer the components that would trigger
				those messages.
			</p>

			<p>
				Messages are added through
				<router-link v-bind="{ to: '/composables/use-flash-messages' }">
					<code>useFlashMessages</code>
				</router-link>
				.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-example">
				<template #name>namespace</template>

				<template #type>String</template>

				<template #default-value>null</template>

				<p>
					The namespace from which to retrieve messages. If no namespace is provided, only messages
					without a namespace will be displayed.
				</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>default</template>

				<p>
					Custom content for each message. The slot receives the stored
					<code>message</code>
					object, including its generated
					<code>id</code>
					. If no default slot is provided, each message is shown with
					<code>alert-message</code>
					.
				</p>
			</component-slot>

			<component-slot id="slot-icon">
				<template #name>icon</template>

				<p>
					Any icon to display in the default
					<code>alert-message</code>
					output.
				</p>
			</component-slot>
		</component-slots>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="flash-messages"</template>

				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-flash-messages />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFlashMessages from "./fragments/playground-flash-messages.vue";
</script>
