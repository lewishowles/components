<template>
	<component-page>
		<template #title>
			Alert message
		</template>

		<template #introduction>
			<p>The <code>alert-message</code> component is designed to display an accessible message to the user.</p>
		</template>

		<component-props>
			<component-prop id="prop-type">
				<template #name>
					type
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					muted
				</template>

				<p>The type of alert, one of <code>success</code>, <code>error</code>, <code>warning</code>, <code>info</code> or <code>muted</code>. Note that a <code>muted</code> alert does not have an icon by default.</p>
			</component-prop>

			<component-prop id="prop-show-icon">
				<template #name>
					showIcon
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					true
				</template>

				<p>Whether to show an icon with the alert. Note that a <code>muted</code> alert does not have an icon by default.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-title">
				<template #name>
					title
				</template>

				<p>Any title to display with the message.</p>
			</component-slot>

			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The default slot contains the content of the alert.</p>
			</component-slot>

			<component-slot id="slot-icon">
				<template #name>
					icon
				</template>

				<p>Any icon to display in the alert, overriding any default icon.</p>
			</component-slot>
		</component-slots>

		<component-playgrounds>
			<playground-alert-message />
			<playground-alert-message-info />
			<playground-alert-message-success />
			<playground-alert-message-warning />
			<playground-alert-message-error />
			<playground-alert-message-custom-icon />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundAlertMessage from "./fragments/playground-alert-message.vue";
import PlaygroundAlertMessageInfo from "./fragments/playground-alert-message-info.vue";
import PlaygroundAlertMessageSuccess from "./fragments/playground-alert-message-success.vue";
import PlaygroundAlertMessageWarning from "./fragments/playground-alert-message-warning.vue";
import PlaygroundAlertMessageError from "./fragments/playground-alert-message-error.vue";
import PlaygroundAlertMessageCustomIcon from "./fragments/playground-alert-message-custom-icon.vue";
</script>
