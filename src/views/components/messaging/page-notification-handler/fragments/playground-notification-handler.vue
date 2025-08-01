<template>
	<component-playground v-bind="{ copy: template }" id="playground-notification-handler" v-model="textSlots">
		<template #title>
			Notification handler
		</template>

		<template #introduction>
			<p>Displaying a sample set of notifications.</p>
		</template>

		<div class="flex justify-end">
			<notification-handler v-bind="componentProps">
				{{ textSlots.default?.value }}
			</notification-handler>
		</div>

		<template #additional-code>
			<code-block :code="`const notifications = ${JSON.stringify(notifications, null, '\t')};`" />
		</template>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	"show-notifications-label": {
		label: "Show notifications label",
		value: "Show notifications",
	},
	"no-notifications-label": {
		label: "No notifications label",
		value: "No new notifications",
	},
	"mark-all-read-label": {
		label: "Mark all notifications read label",
		value: "Mark all notifications read",
	},
	"reload-label": {
		label: "Reload notifications label",
		value: "Reload notifications",
	},
	"loading-label": {
		label: "Loading notifications label",
		value: "Loading notifications",
	},
	"mark-read-label": {
		label: "Mark single notification read label",
		value: "Mark read",
	},
	"view-more-label": {
		label: "View more details label",
		value: "View more",
	},
});

const notifications = [
	{
		id: "f78e6fd5-a84a-49fa-8b6c-e30279ff805a",
		type: "info",
		title: "Scheduled maintenance",
		message: "Our system will undergo maintenance on March 15th from 2 AM to 5 AM. Please save your work and log out before this time.",
		date: "2025-03-22",
		icon: "icon-spanner",
		pinned: true,
	},
	{
		id: "47f61987-b882-45ee-8159-3ba896e435f7",
		type: "info",
		title: "Your document is ready to view",
		message: "The document, Property Portfolio, XH1530, generated at 10:54, is now ready to view.",
		date: "2025-03-22",
		icon: "icon-document",
	},
	{
		id: "eed20d2b-3f2c-4c85-bc4f-b7f99ef19efa",
		type: "warning",
		title: "Your subscription is due to expire",
		message: "Your subscription is due to expire in 3 days (24 Mar). Renew now to avoid interruptions.",
		date: "2025-03-21",
		icon: "icon-card",
	},
	{
		id: "e96f9a8f-0a8c-44f0-ae41-131ba311d8e8",
		type: "danger",
		title: "Security alert",
		message: "Unauthorised login attempt detected. Please secure your account immediately.",
		date: "2025-03-20",
		icon: "icon-padlock",
	},
	{
		id: "b0376fcc-105e-4424-bbf7-0953b0dcc521",
		type: "info",
		title: "Profile updated",
		message: "Your profile has been successfully updated.",
		date: "2025-03-19",
		icon: "icon-user",
		read: true,
	},
];

// Props both for the template and for the component example itself.
const props = ref({
	notifications: {
		label: "Notifications",
		value: notifications,
		type: "array",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("notification-handler", { slots: textSlots, props });
</script>
