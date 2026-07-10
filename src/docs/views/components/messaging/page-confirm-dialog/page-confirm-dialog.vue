<template>
	<component-page>
		<template #title>Confirm dialog</template>

		<template #introduction>
			<p>
				<code>confirm-dialog</code>
				is a
				<a href="/messaging/modal-dialog"><code>modal-dialog</code></a>
				built for confirm/cancel decisions, such as destructive actions. It renders with the
				<code>alert</code>
				variant, so it interrupts the user and requires a response.
			</p>

			<p>
				Use it directly via
				<code>openModal</code>
				, following the
				<a href="/messaging/modal-controller"><code>modal-controller</code></a>
				contract.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-danger">
				<template #name>danger</template>

				<template #type>Boolean</template>

				<template #default-value>false</template>

				<p>Whether the confirm action is destructive, styling the confirm button to match.</p>
			</component-prop>

			<component-prop id="prop-on-confirm">
				<template #name>onConfirm</template>

				<template #type>Function</template>

				<template #default-value>null</template>

				<p>
					Called when the confirm action is chosen. Dialogs close immediately, so user-feedback
					should be provided by the parent, outside of the dialog itself.
				</p>
			</component-prop>

			<component-prop id="prop-on-close">
				<template #name>onClose</template>

				<template #type>Function</template>

				<template #default-value>null</template>

				<p>Called when this dialog closes, for any reason.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-title">
				<template #name>title</template>

				<p>The title of the dialog.</p>
			</component-slot>

			<component-slot id="slot-default">
				<template #name>default</template>

				<p>The body content: the question or explanation the user needs to decide on.</p>
			</component-slot>

			<component-slot id="slot-confirm-button-label">
				<template #name>confirm-button-label</template>

				<p>Content for the confirm button. Defaults to "Confirm".</p>
			</component-slot>

			<component-slot id="slot-cancel-button-label">
				<template #name>cancel-button-label</template>

				<p>Content for the cancel button. Defaults to "Cancel".</p>
			</component-slot>
		</component-slots>

		<component-playgrounds>
			<playground-confirm-dialog />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundConfirmDialog from "./fragments/playground-confirm-dialog.vue";
</script>
