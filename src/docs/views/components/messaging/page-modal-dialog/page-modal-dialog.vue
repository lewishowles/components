<template>
	<component-page>
		<template #title>
			Modal dialog
		</template>

		<template #introduction>
			<p>The <code>modal-dialog</code> component provides a base modal dialog. When opened, the user's focus is moved to the dialog, and the rest of the page is made inert.</p>
			<p>Dialogs should be used sparingly, ideally for confirmation actions.</p>
			<p>Using <a href="/messaging/modal-controller"><code>modal-controller</code></a> with <code>useModalDialog</code> is recommended, as opposed to creating individual modals within other components.</p>
		</template>

		<component-props>
			<component-prop id="prop-initially-open">
				<template #name>
					initiallyOpen
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					false
				</template>

				<p>Whether the dialog should open itself immediately. This is true by default for use with <code>modal-controller</code>, but will likely need to be set to false if used directly.</p>
			</component-prop>

			<component-prop id="prop-focus-dialog-on-open">
				<template #name>
					focusDialogOnOpen
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					true
				</template>

				<p>When opening the dialog, determine whether to focus the dialog itself, or the first focusable element within it.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-title">
				<template #name>
					title
				</template>

				<p>The title of the dialog.</p>
			</component-slot>

			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The main content of the dialog.</p>
			</component-slot>

			<component-slot id="slot-actions">
				<template #name>
					actions
				</template>

				<p>Any specific action buttons the user should be able to interact with.</p>
			</component-slot>
		</component-slots>

		<component-events>
			<component-event id="event-dialog:close">
				<template #name>
					dialog:close
				</template>

				<p>Fired when the dialog is closed by the user.</p>
			</component-event>
		</component-events>

		<component-methods>
			<component-method id="method-open">
				<template #name>
					<code>open</code>
				</template>

				<p>Open the dialog.</p>
			</component-method>

			<component-method id="method-close">
				<template #name>
					<code>close</code>
				</template>

				<p>Close the dialog.</p>
			</component-method>
		</component-methods>

		<component-playgrounds>
			<playground-modal-dialog />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundModalDialog from "./fragments/playground-modal-dialog.vue";
</script>
