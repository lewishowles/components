<template>
	<component-page>
		<template #title>Copy content</template>

		<template #introduction>
			<p>
				<code>copy-content</code>
				utilises
				<code>ui-button</code>
				to copy given content when activated.
			</p>
			<p>
				Because this component utilises the
				<router-link v-bind="{ to: '/interaction/ui-button' }">
					<code>ui-button</code>
				</router-link>
				component, all props and slots from that component also apply.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-content">
				<template #name>content</template>

				<template #type>string</template>

				<template #default-value>null</template>

				<p>The content to copy to the user's clipboard when activated.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>default</template>

				<template #default-value>Copy</template>

				<p>The text of the button. This should ideally explain what is being copied.</p>
			</component-slot>

			<component-slot id="slot-copy-success-label">
				<template #name>copy-success-label</template>

				<template #default-value>Copied</template>

				<p>
					The text to display briefly when content has been copied. Note that the label will be
					displayed overlaid on the button, to avoid content shift, but for safety if the message is
					longer than the button text, it will replace the content to ensure that the message is
					displayed correctly.
				</p>
			</component-slot>

			<component-slot id="slot-copy-error-label">
				<template #name>copy-error-label</template>

				<template #default-value>Error</template>

				<p>
					The text to display briefly when content couldn't be copied, either because there was no
					content to copy, or the browser refused. Note that the label will be displayed overlaid on
					the button, to avoid content shift, but for safety if the message is longer than the
					button text, it will replace the content to ensure that the message is displayed
					correctly.
				</p>
			</component-slot>
		</component-slots>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="copy-content"</template>
				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-label">
				<template #attribute>data-part="label"</template>
				<p>The default label and clipboard icon, visible when no copy operation is in progress.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-success">
				<template #attribute>data-part="success"</template>
				<p>The success feedback element, shown briefly after a successful copy.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-error">
				<template #attribute>data-part="error"</template>
				<p>The error feedback element, shown briefly when copying fails.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-copied">
				<template #attribute>data-copied</template>
				<p>Present on the root element while the success state is displayed.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-copy-content />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundCopyContent from "./fragments/playground-copy-content.vue";
</script>
