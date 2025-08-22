<template>
	<component-playground v-bind="{ copy: template }" id="playground-notification-handler" v-model="textSlots">
		<template #title>
			No notifications
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
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

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

const notifications = [];

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
