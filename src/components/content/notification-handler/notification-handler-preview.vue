<template>
	<preview-wrapper>
		<template #title>
			notification-handler
		</template>

		<preview-section>
			<template #title>
				Basic notifications
			</template>

			<notification-handler v-bind="{ notifications, align: 'start', }" />
		</preview-section>

		<preview-section>
			<template #title>
				Component options
			</template>

			<template #subtitle>
				Hiding "read" notifications
			</template>

			<notification-handler v-bind="{ notifications, align: 'start', hideNotificationsWhenRead: true }" />
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { nanoid } from "nanoid";

const unreadNotification = {
	id: nanoid(),
	message: "Don't forget to check your tasks for today!",
};

const readNotification = {
	id: nanoid(),
	title: "Profile updated",
	message: "Your profile has been successfully updated.",
	read: true,
};

const extendedNotification = {
	id: nanoid(),
	title: "Scheduled maintenance",
	message: "Our system will undergo maintenance on March 15th from 2 AM to 5 AM. Please save your work and log out before this time.",
	date: "2025-03-22",
	pinned: true,
	url: "https://example.com/maintenance-info",
};

const warningNotification = {
	id: nanoid(),
	title: "Your subscription is due to expire",
	message: "Your subscription is due to expire in 3 days (24 Mar). Renew now to avoid interruptions.",
	type: "warning",
};

const dangerNotification = {
	id: nanoid(),
	title: "Security alert",
	message: "Unauthorised login attempt detected. Please secure your account immediately.",
	type: "danger",
};

const imageNotification = {
	id: nanoid(),
	title: "Notification with image",
	message: "This notification has a an image",
	image_url: "https://placehold.co/100x100",
};

const iconNotification = {
	id: nanoid(),
	title: "Notification with icon",
	message: "This notification has an icon",
	icon: "icon-user",
};

const notifications = [
	readNotification,
	unreadNotification,
	extendedNotification,
	warningNotification,
	dangerNotification,
	imageNotification,
	iconNotification,
];
</script>
